'use strict';

import { entityType } from '../CONSTANT';
import { insertImageBlock, insertImagesBlock } from './insert-atomic-block';
import { replaceImageBlock, replaceImagesBlock } from './replace-block';
import { Entity } from 'draft-js';
import removeBlock from './remove-block';

const handleAtomicEdit = (editorState, blockKey, valueChanged) => {
    const block = editorState.getCurrentContent().getBlockForKey(blockKey);
    const entityKey = block.getEntityAt(0)
    let blockType;
    try {
        blockType = entityKey ? Entity.get(entityKey).getType() : null;
    } catch (e) {
        console.log('Get entity type in the block occurs error ', e);
        return editorState;
    }

    switch (blockType) {
        case entityType.image:
            if (valueChanged) {
                return replaceImageBlock(editorState, blockKey, valueChanged);
            }
            return removeBlock(editorState, blockKey);
        case entityType.slideshow:
            if (Array.isArray(valueChanged) && valueChanged.length > 0) {
                return replaceImagesBlock(editorState, blockKey, valueChanged);
            }
            return removeBlock(editorState, blockKey);
        case entityType.imageDiff:
            if (Array.isArray(valueChanged) && valueChanged.length === 2) {
                return replaceImagesBlock(editorState, blockKey, valueChanged);
            }
            return removeBlock(editorState, blockKey);
        default:
            return editorState;
    }
};

export default {
    handleAtomicEdit
};
