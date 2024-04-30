import mongoose, { Document, ObjectId, Schema } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description: string;
  date: string;
  hour: string;
  duration: number;
  tags: ObjectId[]; 
}

const TaskSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true},
  hour: { type: String, required: true},
  duration: { type: Number, required: true },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }] 

});

export default mongoose.model<ITask>('Task', TaskSchema);