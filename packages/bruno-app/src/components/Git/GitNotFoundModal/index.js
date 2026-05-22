import React from 'react';
import Modal from 'components/Modal/index';
import Portal from 'components/Portal/index';
import { useTranslation } from 'react-i18next';

const getOSName = () => {
  const platform = window.navigator.userAgentData?.platform || '';
  if (platform.startsWith('Win')) {
    return 'Windows';
  } else if (platform.startsWith('Mac')) {
    return 'macOS';
  } else if (platform.startsWith('Linux')) {
    return 'Linux';
  } else {
    return 'your OS';
  }
};

const getDownloadUrl = (os) => {
  switch (os) {
    case 'Windows':
      return 'https://git-scm.com/download/win';
    case 'macOS':
      return 'https://git-scm.com/download/mac';
    case 'Linux':
      return 'https://git-scm.com/download/linux';
    default:
      return 'https://git-scm.com/download';
  }
};

const GitNotFoundModal = ({ onClose }) => {
  const { t } = useTranslation();
  const osName = getOSName();
  const downloadUrl = getDownloadUrl(osName);

  return (
    <Portal>
      <Modal
        size="sm"
        title={t('GIT.GIT_NOT_FOUND_TITLE')}
        handleCancel={onClose}
        hideFooter={true}
      >
        <div>
          <p>{t('GIT.GIT_NOT_FOUND_BODY')}</p>
          <p className="mt-2">
            {t('GIT.DOWNLOAD_FOR_OS_PREFIX')} <strong>{osName}</strong> {t('GIT.DOWNLOAD_FOR_OS_SUFFIX')}
          </p>
          <p>
            <span
              className="text-blue-600 cursor-pointer border-b border-blue-600"
              onClick={() => window.open(downloadUrl, '_blank')}
            >
              {t('GIT.DOWNLOAD_FOR_OS', { osName })}
            </span>
          </p>
        </div>
      </Modal>
    </Portal>
  );
};

export default GitNotFoundModal;
