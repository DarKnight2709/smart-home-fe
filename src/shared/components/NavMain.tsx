import { ChevronRight } from 'lucide-react'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from '@/shared/components/ui/sidebar'
import { hasPermission } from '@/shared/lib/utils'
import { Fragment, useMemo } from 'react'
import { NavLink, useLocation } from 'react-router'
import type { NavItem } from '../lib/nav-main'
import type { PermissionType } from '../validations/PermissionSchema'
import { HoverMarquee } from './marquee/HoverMarquee'

// item: nav-main
// permissions: các quyền của người dùng.
export function NavMain({ items, permissions, roles }: { items: NavItem[]; permissions: PermissionType[], roles: any[] }) {
  // lấy url hiện tại
  const location = useLocation()

  // Helper function để check xem có item nào trong nhóm menu(có sub-items) đang active không
  // Active nếu: ít nhất 1 sub-item khớp chính xác URL hoặc URL hiện tại nằm trong cây của sub-item (ví dụ: /visiting-lecturers/create sẽ active nhóm /visiting-lecturers)
  const isGroupActive = (groupItems: any[]) => {
    return groupItems.some((subItem) => {
      // Exact match
      if (location.pathname === subItem.url) return true

      // Check for nested routes (ví dụ: /visiting-lecturers/create thuộc về group visiting-lecturers)
      if (subItem.url !== '/' && location.pathname.startsWith(subItem.url + '/')) {
        return true
      }

      return false
    })
  }

  // Tương tự cho từng item đơn lẻ
  // Helper function để check active state cho individual items
  const isItemActive = (itemUrl: string) => {
    // Exact match
    if (location.pathname === itemUrl) return true

    // Check for nested routes
    if (itemUrl !== '/' && location.pathname.startsWith(itemUrl + '/')) {
      return true
    }

    return false
  }

  // lọc menu dựa theo quyền
  // dùng useMemo để tránh tính toàn lại mỗi lần render

  const filteredItems = useMemo(() => {
    // Nếu có system role thì trả về tất cả, không lọc
    const isSystem = roles?.some((role) => role.isSystemRole);
    if (isSystem) {
      return items;
    }
  
    // Ngược lại: lọc theo permission
    return items
      .filter((item) => {
        // Nếu có group sub-items
        if (item.items && item.items.length > 0) {
          const allowedSubItems = item.items.filter((subItem) => {
            if (!subItem.requiredPermission) return true;
            return hasPermission(permissions, subItem.requiredPermission);
          });
  
          return allowedSubItems.length > 0;
        }
  
        // Nếu là single item và có requiredPermission
        if (item.requiredPermission) {
          return hasPermission(permissions, item.requiredPermission);
        }
  
        // Mặc định được hiển thị
        return true;
      })
      .map((item) => {
        if (item.items && item.items.length > 0) {
          return {
            ...item,
            items: item.items.filter((subItem) => {
              if (!subItem.requiredPermission) return true;
              return hasPermission(permissions, subItem.requiredPermission);
            }),
          };
        }
        return item;
      });
  }, [items, permissions, roles]);
  

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Hệ thống quản lý nhà thông minh</SidebarGroupLabel>
      <SidebarMenu>
        {filteredItems.map((item) => {
          const hasActiveChild = item.items ? isGroupActive(item.items) : false

          return (
            <Fragment key={item.title}>
              {item.items && item.items.length > 0 ? (
                <Collapsible key={item.title} asChild defaultOpen={hasActiveChild} className='group/collapsible'>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title} isActive={hasActiveChild}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => {
                          const isActive = isItemActive(subItem.url)

                          return (
                            <SidebarMenuSubItem key={subItem.title} title={subItem.title}>
                              <SidebarMenuSubButton asChild isActive={isActive}>
                                <NavLink to={subItem.url} className='w-full'>
                                  <HoverMarquee text={subItem.title} active={isActive} className='flex-1' />
                                </NavLink>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isItemActive(item.url)} tooltip={item.title}>
                    <NavLink to={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </Fragment>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
