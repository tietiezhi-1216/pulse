import React, { useRef, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Modal from 'components/Modal';
import { isGitRepositoryUrl } from 'utils/git';
import { connectCollectionToGit } from 'providers/ReduxStore/slices/workspaces/actions';
import { Trans, useTranslation } from 'react-i18next';

const ConnectGitRemote = ({ collectionPath, collectionName, initialUrl = '', onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const inputRef = useRef();
  const activeWorkspaceUid = useSelector((state) => state.workspaces.activeWorkspaceUid);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      remoteUrl: initialUrl
    },
    validationSchema: Yup.object({
      remoteUrl: Yup.string()
        .trim()
        .required(t('COLLECTIONS_LIST.GIT_REMOTE_URL_REQUIRED'))
        .test('is-git-url', t('COLLECTIONS_LIST.GIT_REMOTE_URL_INVALID'), (value) => isGitRepositoryUrl(value))
    }),
    onSubmit: (values) => {
      dispatch(
        connectCollectionToGit({
          workspaceUid: activeWorkspaceUid,
          collectionPath,
          remoteUrl: values.remoteUrl.trim()
        })
      )
        .then(() => {
          toast.success(t('COLLECTIONS_LIST.GIT_REMOTE_CONNECTED'));
          onClose();
        })
        .catch(() => {
          // toast already handled in the thunk
        });
    }
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const title = initialUrl ? t('COLLECTIONS_LIST.UPDATE_GIT_REMOTE') : t('COLLECTIONS_LIST.CONNECT_TO_GIT');
  const confirmText = initialUrl ? t('COMMON.UPDATE') : t('COMMON.CONNECT');

  return (
    <Modal size="md" title={title} confirmText={confirmText} handleConfirm={() => formik.handleSubmit()} handleCancel={onClose}>
      <form className="bruno-form" onSubmit={(e) => e.preventDefault()}>
        {collectionName ? (
          <div className="text-sm text-muted mb-3 leading-relaxed break-words space-y-2">
            <p className="m-0">
              <Trans
                i18nKey="COLLECTIONS_LIST.LINKING_TO_GIT_REMOTE"
                values={{ collectionName }}
                components={{
                  collectionName: <span className="font-medium text-inherit break-words" title={collectionName} />
                }}
              />
            </p>
            <p className="m-0">
              <Trans
                i18nKey="COLLECTIONS_LIST.GIT_REMOTE_WORKSPACE_ONLY"
                components={{
                  workspaceFile: <span className="font-mono">workspace.yml</span>
                }}
              />
            </p>
          </div>
        ) : null}
        <div>
          <label htmlFor="remoteUrl" className="block font-medium">
            {t('COLLECTIONS_LIST.GIT_REMOTE_URL')}
          </label>
          <input
            id="remoteUrl"
            type="text"
            name="remoteUrl"
            ref={inputRef}
            className="block textbox mt-2 w-full"
            placeholder="https://github.com/owner/repo"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            onChange={formik.handleChange}
            value={formik.values.remoteUrl || ''}
          />
          {formik.touched.remoteUrl && formik.errors.remoteUrl ? (
            <div className="text-red-500">{formik.errors.remoteUrl}</div>
          ) : null}
        </div>
      </form>
    </Modal>
  );
};

export default ConnectGitRemote;
