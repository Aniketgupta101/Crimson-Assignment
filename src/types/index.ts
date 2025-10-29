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

export interface ResearchPaper {
  id: number;
  papertitle: string;
  coauthors: string;
  published_at: string;
  articlelink?: string;
  doi?: string;
  abstract?: string;
  keywords?: string[];
  publishername: string;
  volume?: string;
  issue?: string;
  pages?: string;
  language?: string;
  citation_count?: number;
  download_count?: number;
  view_count?: number;
  peer_reviewed?: boolean;
  open_access?: boolean;
  license?: string;
  funding?: string;
  acknowledgments?: string;
  methodology?: string;
  results?: string;
  conclusions?: string;
  limitations?: string;
  future_work?: string;
  research_type?: string;
  study_design?: string;
  sample_size?: number;
  data_collection_period?: string;
  ethical_approval?: string;
  conflicts_of_interest?: string;
  author_contributions?: string;
  data_availability?: string;
  supplementary_materials?: string;
  related_papers?: string[];
  references?: string[];
  image?: string;
  figure?: string;
  journal: {
    id: number;
    title: string;
    journalabbreviation?: string;
    impactfactor: number;
    issn?: string;
    eissn?: string;
    country?: string;
    website?: string;
    description?: string;
    publisher?: string;
    founded_year?: number;
    frequency?: string;
    editor_in_chief?: string;
    editorial_board?: string[];
    indexing?: string[];
    quartile?: string;
    category?: string;
    scope?: string;
    submission_guidelines?: string;
    review_process?: string;
    acceptance_rate?: number;
    average_review_time?: string;
    publication_fee?: string;
  };
  salevelone: {
    id: number;
    name: string;
    description?: string;
    icon?: {
      url: string;
      alternativeText?: string;
    };
    parent_category?: string;
    subcategories?: string[];
  };
  servicetype: {
    id: number;
    servicename: string;
    description?: string;
    price?: number;
    currency?: string;
    duration?: string;
    features?: string[];
    requirements?: string[];
  };
  authors?: {
    id: number;
    name: string;
    email?: string;
    affiliation?: string;
    orcid?: string;
    research_interests?: string[];
    h_index?: number;
    citation_count?: number;
    publications_count?: number;
    is_corresponding?: boolean;
    order?: number;
  }[];
  institutions?: {
    id: number;
    name: string;
    country?: string;
    city?: string;
    type?: string;
    ranking?: number;
    website?: string;
  }[];
  funding_sources?: {
    id: number;
    name: string;
    grant_number?: string;
    amount?: number;
    currency?: string;
    duration?: string;
  }[];
  metrics?: {
    altmetric_score?: number;
    citation_count?: number;
    download_count?: number;
    view_count?: number;
    social_media_shares?: number;
    news_mentions?: number;
    blog_mentions?: number;
  };
  tags?: string[];
  categories?: string[];
  status?: string;
  version?: string;
  last_updated?: string;
  created_at?: string;
  updated_at?: string;
}
