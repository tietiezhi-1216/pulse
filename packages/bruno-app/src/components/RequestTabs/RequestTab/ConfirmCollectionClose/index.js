import React from 'react';
import { IconAlertTriangle } from '@tabler/icons';
import Modal from 'components/Modal';
import Button from 'ui/Button';
import { Trans, useTranslation } from 'react-i18next';

const ConfirmCollectionClose = ({ collection, onCancel, onCloseWithoutSave, onSaveAndClose }) => {
  const { t } = useTranslation();

  return (
    <Modal
      size="md"
      title={t('UNSAVED.TITLE')}
      confirmText={t('UNSAVED.SAVE_AND_CLOSE')}
      cancelText={t('UNSAVED.CLOSE_WITHOUT_SAVING')}
      disableEscapeKey={true}
      disableCloseOnOutsideClick={true}
      closeModalFadeTimeout={150}
      handleCancel={onCancel}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      hideFooter={true}
    >
      <div className="flex items-center font-normal">
        <IconAlertTriangle size={32} strokeWidth={1.5} className="text-yellow-600" />
        <h1 className="ml-2 text-lg font-medium">{t('UNSAVED.HOLD_ON')}</h1>
      </div>
      <div className="font-normal mt-4">
        <Trans
          i18nKey="UNSAVED.COLLECTION_MESSAGE"
          values={{ name: collection.name }}
          components={{ name: <span className="font-medium" /> }}
        />
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
  );
};

export default ConfirmCollectionClose;
