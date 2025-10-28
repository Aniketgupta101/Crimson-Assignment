export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
  success: boolean;
}

export interface DataItem {
  id: string | number;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  status?: 'active' | 'inactive' | 'pending';
  category?: string;
  tags?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user' | 'moderator';
  createdAt: string;
  lastLogin?: string;
}

export interface BlogPost extends DataItem {
  content: string;
  author: User;
  featuredImage?: string;
  readTime: number;
  views: number;
  likes: number;
  comments: number;
}

export interface Product extends DataItem {
  price: number;
  currency: string;
  images: string[];
  inStock: boolean;
  stockQuantity: number;
  brand: string;
  specifications?: Record<string, string>;
}

export interface Event extends DataItem {
  startDate: string;
  endDate: string;
  location: string;
  capacity: number;
  registeredUsers: number;
  price: number;
  currency: string;
  organizer: User;
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, any>;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface FilterOptions {
  search?: string;
  category?: string;
  status?: string;
  sortBy?: 'date' | 'title' | 'views' | 'likes';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface CardProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
  image?: string;
  actions?: React.ReactNode;
  hover?: boolean;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface FormProps extends BaseComponentProps {
  onSubmit: (data: any) => void;
  initialValues?: Record<string, any>;
  validationSchema?: any;
  loading?: boolean;
}

export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  label?: string;
}

export interface SelectProps extends BaseComponentProps {
  options: Array<{ value: string; label: string }>;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  label?: string;
}
