import React from 'react';
import { IconAlertTriangle } from '@tabler/icons';
import Modal from 'components/Modal';
import Portal from 'components/Portal';
import Button from 'ui/Button';
import { useTranslation } from 'react-i18next';

const ConfirmCloseEnvironment = ({ onCancel, onCloseWithoutSave, onSaveAndClose, isGlobal, isDotEnv }) => {
  const { t } = useTranslation();
  let settingsLabel = t('ENVIRONMENTS.COLLECTION_ENVIRONMENT_SETTINGS');
  if (isDotEnv) {
    settingsLabel = '.env file';
  } else if (isGlobal) {
    settingsLabel = t('ENVIRONMENTS.GLOBAL_ENVIRONMENT_SETTINGS');
  }

  return (
    <Portal>
      <Modal
        size="md"
        title={t('UNSAVED.TITLE')}
        disableEscapeKey={true}
        disableCloseOnOutsideClick={true}
        closeModalFadeTimeout={150}
        handleCancel={onCancel}
        hideFooter={true}
      >
        <div className="flex items-center font-normal">
          <IconAlertTriangle size={32} strokeWidth={1.5} className="text-yellow-600" />
          <h1 className="ml-2 text-lg font-medium">{t('UNSAVED.HOLD_ON')}</h1>
        </div>
        <div className="font-normal mt-4">
          {t('UNSAVED.ENVIRONMENT_MESSAGE', { settingsLabel })}
        </div>

        <div className="flex justify-between mt-6">
          <div>
            <Button color="danger" onClick={onCloseWithoutSave}>
              {t('UNSAVED.DONT_SAVE')}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button size="sm" color="secondary" variant="ghost" onClick={onCancel}>
              {t('COMMON.CANCEL')}
            </Button>
            <Button onClick={onSaveAndClose}>
              {t('COMMON.SAVE')}
            </Button>
          </div>
        </div>
      </Modal>
    </Portal>
  );
};

export default ConfirmCloseEnvironment;
