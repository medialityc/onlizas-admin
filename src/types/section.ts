import { PaginatedResponse } from "./common";

export enum TEMPLATE_TYPE_ENUM {
  carousel,
  featured,
  list,
  masonry,
}

export type ISection = {
  id: number;
  name: string;
  description: string;
  viewMoreUrl: string;
  active: true;
  displayOrder: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  createdBy: string;
  templateType: TEMPLATE_TYPE_ENUM;
  defaultItemCount: number;
  backgroundColor: string;
  textColor: string;
  isPersonalized: true;
  targetUserSegment: string;
  targetDeviceType: string;
  startDate: Date | string;
  endDate: Date | string;
  products: [
    {
      productGlobalId: string;
      displayOrder: number;
      isFeatured: true;
      customLabel: string;
      customBackgroundColor: string;
      addedAt: Date | string;
      product?: any;
    },
  ];
  banners: [
    {
      imageUrl: string;
      title: string;
      subtitle: string;
      buttonText: string;
      buttonUrl: string;
      position: string;
      displayOrder: number;
      startDate: Date | string;
      endDate: Date | string;
      active: true;
    },
  ];
  criteria: [
    {
      criterionType: string;
      criterionValue: string;
      operator: string;
      parentCriterionId: number;
      logicalOperator: string;
      priority: number;
    },
  ];
};

export type CreateSection = ISection;
export type UpdateSection = ISection;

export type IGetAllAdminsSection = PaginatedResponse<ISection>;
