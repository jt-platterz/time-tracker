export interface IEvent {
  id: number;
  title: string;
  datetime: Date | string;
  subcategory_id: number;
  category_id: number;
}
