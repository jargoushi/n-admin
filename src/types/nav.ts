export interface NavItem {
  title: string;
  url: string;
  icon?: any;
  isActive?: boolean;
  items?: NavItem[];
}
