import { Request, Response } from 'express';
import * as TagService from '../services/TagService';


interface ErrorResponse {
    message: string;
    [key: string]: any;
}

export async function createTagController(req: Request, res: Response): Promise<void> {
    try {
        const tag = await TagService.createTagService(req.body);
        res.status(201).json(tag);
    } catch (error) {
        const err = error as ErrorResponse;
        res.status(400).json({error: err.message})
    }
}

export const updateTagController = async (req: Request, res: Response): Promise<void> => {
    try {
        const tag = await TagService.updateTagService(req.params.id, req.body);
        if(!tag) {
            res.status(404).json({ message: 'Tag not found ' });
            return;
        }
        res.status(200).json(tag);
    } catch (error) {
        const err = error as ErrorResponse;
        res.status(400).json({ error: err.message })
    }
}

export const deleteTagController = async (req: Request, res: Response): Promise<void> => {
    try {
        const tag = await TagService.deleteTagService(req.params.id);
        if (!tag) {
            res.status(404).json({ message: 'Tag not found ' });
            return;
        }
        res.status(200).json({ message: 'Tag Deleted successfully '});
    } catch (error) {
        const err = error as ErrorResponse;
        res.status(404).json({ error: err.message })
    }
}

export const gettAllTags = async (req: Request, res: Response): Promise<void> => {
    try {
        const tag = await TagService.getAllTagsService();
        res.status(200).json(tag);
    } catch (error) {
        const err = error as ErrorResponse;
        res.status(404).json({ error: err.message })
    }
}