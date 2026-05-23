import React, { useEffect, useState, useCallback } from 'react';
import { closeTabs } from 'providers/ReduxStore/slices/collections/actions';
import { useDispatch } from 'react-redux';
import ErrorBanner from 'ui/ErrorBanner';
import Button from 'ui/Button';
import { useTranslation } from 'react-i18next';

const FolderNotFound = ({ folderUid }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const closeTab = useCallback(() => {
    dispatch(
      closeTabs({
        tabUids: [folderUid]
      })
    );
  }, [dispatch, folderUid]);

  useEffect(() => {
    setTimeout(() => {
      setShowErrorMessage(true);
    }, 300);
  }, []);

  if (!showErrorMessage) {
    return null;
  }

  const errors = [
    {
      title: t('REQUEST_PANEL.ERRORS.FOLDER_NOT_FOUND_TITLE'),
      message: t('REQUEST_PANEL.ERRORS.FOLDER_NOT_FOUND_MESSAGE')
    }
  ];

  return (
    <div className="mt-6 px-6">
      <ErrorBanner errors={errors} className="mb-4" />
      <Button size="md" color="secondary" variant="ghost" onClick={closeTab}>
        {t('REQUEST_PANEL.ERRORS.CLOSE_TAB')}
      </Button>
    </div>
  );
};

export default FolderNotFound;
