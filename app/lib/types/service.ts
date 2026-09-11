export enum PriceType {
  FIXED = "fixed",
  RANGE = "range",
  PERCENT = "percent",
}

export interface ServiceProps {
  id: string
  name: string
  description: string
  durationMinutes: number;
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  isactive: boolean
  tenantId: string
  serviceResponsabilities?: ServiceResponsibility[]
  prices?: ServicePrice[]
}

export interface ServicePrice {
  id: string
  serviceId: string
  type: PriceType
  amount?: number | string | null
  minAmount?: number | string | null
  maxAmount?: number | string | null
  currency?: string
  employeeId?: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateServicePriceDto {
  type: PriceType
  amount?: number
  minAmount?: number
  maxAmount?: number
  employeeId?: string
  isActive?: boolean
}

export interface ServiceResponsibility {
  id: string
  serviceId: string
  userId: string
  createdAt: string
  user: {
    id: string
    username: string
  }
}

export interface CreateServiceResponsibilityDto {
  userId: string
}