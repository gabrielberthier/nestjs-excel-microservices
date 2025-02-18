import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EventDocument = HydratedDocument<Event>;

@Schema()
export class Event {
  @Prop()
  name: string;

  @Prop()
  batch_id: string;

  @Prop({ raw: true, type: Object })
  data: object;
}

export const EventSchema = SchemaFactory.createForClass(Event);
