import React from 'react';
import toast from 'react-hot-toast';
import Modal from 'components/Modal';
import { useDispatch } from 'react-redux';
import { IconFileCode } from '@tabler/icons';
import { closeApiSpecFile } from 'providers/ReduxStore/slices/apiSpec';
import { Trans, useTranslation } from 'react-i18next';

const CloseApiSpec = ({ onClose, apiSpec }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const onConfirm = () => {
    dispatch(closeApiSpecFile({ uid: apiSpec.uid }))
      .then(() => {
        toast.success(t('API_SPEC.CLOSED'));
        onClose();
      })
      .catch(() => toast.error(t('API_SPEC.CLOSE_ERROR')));
  };

  return (
    <Modal size="sm" title={t('API_SPEC.CLOSE')} confirmText={t('COMMON.CLOSE')} handleConfirm={onConfirm} handleCancel={onClose}>
      <div className="flex items-center">
        <IconFileCode size={18} strokeWidth={1.5} />
        <span className="ml-2 mr-4 font-semibold">{apiSpec.name}</span>
      </div>
      <div className="break-words text-xs mt-1">{apiSpec.pathname}</div>
      <div className="mt-4">
        <Trans
          i18nKey="API_SPEC.CLOSE_CONFIRM"
          values={{ name: apiSpec.name }}
          components={{ name: <span className="font-semibold" /> }}
        />
      </div>
      <div className="mt-4">
        {t('API_SPEC.CLOSE_HINT')}
      </div>
    </Modal>
  );
};

export default CloseApiSpec;
