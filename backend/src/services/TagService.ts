import Tag, { ITag } from "../models/Tag";

export const createTagService = async (tagData: ITag): Promise<ITag> => {
    const tag = new  Tag(tagData);
    return await tag.save();
}

export const updateTagService = async (tagId: string, tagData: ITag): Promise<ITag | null> => {
    const tag = await Tag.findByIdAndUpdate(tagId, tagData, {new: true,  runValidators: true});
    return tag;
}

export const deleteTagService = async (tagId: string): Promise<ITag | null> => {
    const tag = await Tag.findByIdAndDelete(tagId);
    return tag;
}

export const getAllTagsService = async (): Promise<ITag[]> => {
    const tag = await Tag.find();
    return tag;
}