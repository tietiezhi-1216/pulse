import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Modal from 'components/Modal';
import { disconnectCollectionFromGit } from 'providers/ReduxStore/slices/workspaces/actions';
import { Trans, useTranslation } from 'react-i18next';

const RemoveGitRemote = ({ collectionPath, collectionName, remoteUrl, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const activeWorkspaceUid = useSelector((state) => state.workspaces.activeWorkspaceUid);

  const handleConfirm = () => {
    dispatch(
      disconnectCollectionFromGit({
        workspaceUid: activeWorkspaceUid,
        collectionPath
      })
    )
      .then(() => {
        toast.success(t('COLLECTIONS_LIST.GIT_REMOTE_REMOVED'));
        onClose();
      })
      .catch(() => {
        // toast already handled in the thunk
      });
  };

  return (
    <Modal
      size="md"
      title={t('COLLECTIONS_LIST.REMOVE_GIT_REMOTE')}
      confirmText={t('COMMON.REMOVE')}
      confirmButtonColor="primary"
      handleConfirm={handleConfirm}
      handleCancel={onClose}
    >
      <div className="text-sm leading-relaxed break-words">
        <p className="m-0">
          <Trans
            i18nKey="COLLECTIONS_LIST.DISCONNECT_GIT_REMOTE"
            values={{ collectionName }}
            components={{
              collectionName: <span className="font-medium break-words" title={collectionName} />
            }}
          />
        </p>
        {remoteUrl ? (
          <p className="mt-2 mb-0 font-mono text-xs text-muted break-all">{remoteUrl}</p>
        ) : null}
        <p className="mt-3 mb-0 text-xs text-muted">
          <Trans
            i18nKey="COLLECTIONS_LIST.REMOVE_GIT_REMOTE_HELP"
            components={{
              workspaceFile: <span className="font-mono">workspace.yml</span>,
              gitFolder: <span className="font-mono">.git</span>
            }}
          />
        </p>
      </div>
    </Modal>
  );
};

export default RemoveGitRemote;
