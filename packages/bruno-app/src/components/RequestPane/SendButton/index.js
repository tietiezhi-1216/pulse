import React from 'react';
import Button from 'ui/Button';
import StyledWrapper from './StyledWrapper';
import { useTranslation } from 'react-i18next';

const SendButton = ({ isLoading = false, onSend, onCancel, testId = 'send-request-btn' }) => {
  const { t } = useTranslation();

  return (
    <StyledWrapper className="ml-2">
      <Button
        size="sm"
        variant={isLoading ? 'outline' : 'filled'}
        color="primary"
        data-testid={testId}
        data-action={isLoading ? 'cancel' : 'send'}
        onClick={isLoading ? onCancel : onSend}
      >
        {isLoading ? t('COMMON.CANCEL') : t('COMMON.SEND')}
      </Button>
    </StyledWrapper>
  );
};

export default SendButton;
