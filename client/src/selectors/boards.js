import { createSelector } from 'redux-orm';

import orm from '../orm';
import { selectPath } from './router';
import { selectCurrentUserId } from './users';
import { isLocalId } from '../utils/local-id';

export const makeSelectBoardById = () =>
  createSelector(
    orm,
    (_, id) => id,
    ({ Board }, id) => {
      const boardModel = Board.withId(id);

      if (!boardModel) {
        return boardModel;
      }

      return boardModel.ref;
    },
  );

export const selectBoardById = makeSelectBoardById();

export const selectCurrentBoard = createSelector(
  orm,
  (state) => selectPath(state).boardId,
  ({ Board }, id) => {
    if (!id) {
      return id;
    }

    const boardModel = Board.withId(id);

    if (!boardModel) {
      return boardModel;
    }

    return boardModel.ref;
  },
);

export const selectMembershipsForCurrentBoard = createSelector(
  orm,
  (state) => selectPath(state).boardId,
  (state) => selectCurrentUserId(state),
  ({ Board }, id, currentUserId) => {
    if (!id) {
      return id;
    }

    const boardModel = Board.withId(id);

    if (!boardModel) {
      return boardModel;
    }

    return boardModel
      .getOrderedMembershipsQuerySet()
      .toModelArray()
      .map((boardMembershipModel) => ({
        ...boardMembershipModel.ref,
        isPersisted: !isLocalId(boardMembershipModel.id),
        user: {
          ...boardMembershipModel.user.ref,
          isCurrent: boardMembershipModel.user.id === currentUserId,
        },
      }));
  },
);

export const selectLabelsForCurrentBoard = createSelector(
  orm,
  (state) => selectPath(state).boardId,
  ({ Board }, id) => {
    if (!id) {
      return id;
    }

    const boardModel = Board.withId(id);

    if (!boardModel) {
      return boardModel;
    }

    return boardModel.labels.toRefArray().map((label) => ({
      ...label,
      isPersisted: !isLocalId(label.id),
    }));
  },
);

export const selectListIdsForCurrentBoard = createSelector(
  orm,
  (state) => selectPath(state).boardId,
  ({ Board }, id) => {
    if (!id) {
      return id;
    }

    const boardModel = Board.withId(id);

    if (!boardModel) {
      return boardModel;
    }

    return boardModel
      .getOrderedListsQuerySet()
      .toRefArray()
      .map((list) => list.id);
  },
);

export const selectFilterUsersForCurrentBoard = createSelector(
  orm,
  (state) => selectPath(state).boardId,
  ({ Board }, id) => {
    if (!id) {
      return id;
    }

    const boardModel = Board.withId(id);

    if (!boardModel) {
      return boardModel;
    }

    return boardModel.filterUsers.toRefArray();
  },
);

export const selectFilterLabelsForCurrentBoard = createSelector(
  orm,
  (state) => selectPath(state).boardId,
  ({ Board }, id) => {
    if (!id) {
      return id;
    }

    const boardModel = Board.withId(id);

    if (!boardModel) {
      return boardModel;
    }

    return boardModel.filterLabels.toRefArray();
  },
);

export const selectIsCurrentUserMemberForCurrentBoard = createSelector(
  orm,
  (state) => selectPath(state).boardId,
  (state) => selectCurrentUserId(state),
  ({ Board }, id, currentUserId) => {
    if (!id) {
      return false;
    }

    const boardModel = Board.withId(id);

    if (!boardModel) {
      return false;
    }

    return boardModel.hasMemberUser(currentUserId);
  },
);

export default {
  makeSelectBoardById,
  selectBoardById,
  selectCurrentBoard,
  selectMembershipsForCurrentBoard,
  selectLabelsForCurrentBoard,
  selectListIdsForCurrentBoard,
  selectFilterUsersForCurrentBoard,
  selectFilterLabelsForCurrentBoard,
  selectIsCurrentUserMemberForCurrentBoard,
};
