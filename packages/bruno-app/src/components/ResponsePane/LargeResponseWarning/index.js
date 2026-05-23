import React from 'react';
import { IconDownload, IconCopy, IconEye, IconAlertTriangle } from '@tabler/icons';
import toast from 'react-hot-toast';
import get from 'lodash/get';
import StyledWrapper from './StyledWrapper';
import { formatSize } from 'utils/common/index';
import Button from 'ui/Button/index';
import { Trans, useTranslation } from 'react-i18next';

const LargeResponseWarning = ({ item, responseSize, onRevealResponse }) => {
  const { ipcRenderer } = window;
  const { t } = useTranslation();
  const response = item.response || {};

  const downloadResponseToFile = () => {
    return new Promise((resolve, reject) => {
      ipcRenderer
        .invoke('renderer:save-response-to-file', response, item.requestSent.url, item.pathname)
        .then((result) => {
          if (result && result.success) {
            toast.success(t('RESPONSE_PANEL.RESPONSE_DOWNLOADED'));
          }
          resolve();
        })
        .catch((err) => {
          toast.error(get(err, 'error.message') || t('COMMON.ERROR_OCCURRED'));
          reject(err);
        });
    });
  };

  const copyResponse = () => {
    try {
      const textToCopy = typeof response.data === 'string'
        ? response.data
        : JSON.stringify(response.data, null, 2);

      navigator.clipboard.writeText(textToCopy).then(() => {
        toast.success(t('RESPONSE_PANEL.RESPONSE_COPIED'));
      }).catch(() => {
        toast.error(t('RESPONSE_PANEL.COPY_RESPONSE_FAILED'));
      });
    } catch (error) {
      toast.error(t('RESPONSE_PANEL.COPY_RESPONSE_FAILED'));
    }
  };

  return (
    <StyledWrapper>
      <div className="warning-container">
        <div className="warning-icon">
          <IconAlertTriangle size={45} strokeWidth={2} />
        </div>
        <div className="warning-content">
          <div className="warning-title">
            {t('RESPONSE_PANEL.LARGE_RESPONSE_WARNING')}
          </div>
          <div className="warning-description">
            <Trans
              i18nKey="RESPONSE_PANEL.LARGE_RESPONSE_DESCRIPTION"
              values={{ size: formatSize(10 * 1024 * 1024) }}
              components={{ size: <span className="size-highlight supported-size" /> }}
            />
            <br />
            <Trans
              i18nKey="RESPONSE_PANEL.CURRENT_RESPONSE_SIZE"
              values={{ size: formatSize(responseSize) }}
              components={{ size: <span className="size-highlight current-size" /> }}
            />
          </div>
        </div>
      </div>
      <div className="warning-actions">
        <Button
          icon={<IconEye size={18} strokeWidth={1.5} />}
          iconPosition="left"
          onClick={onRevealResponse}
          title={t('RESPONSE_PANEL.SHOW_RESPONSE_CONTENT')}
          color="secondary"
          size="sm"
        >
          {t('COMMON.VIEW')}
        </Button>
        <Button
          icon={<IconDownload size={18} strokeWidth={1.5} />}
          iconPosition="left"
          onClick={downloadResponseToFile}
          disabled={!response.dataBuffer}
          title={t('RESPONSE_PANEL.DOWNLOAD_RESPONSE_TO_FILE')}
          color="secondary"
          size="sm"
        >
          {t('COMMON.DOWNLOAD')}
        </Button>
        <Button
          icon={<IconCopy size={18} strokeWidth={1.5} />}
          iconPosition="left"
          onClick={copyResponse}
          disabled={!response.data}
          title={t('RESPONSE_PANEL.COPY_RESPONSE_TO_CLIPBOARD')}
          color="secondary"
          size="sm"
        >
          {t('COMMON.COPY')}
        </Button>
      </div>
    </StyledWrapper>
  );
};

export default LargeResponseWarning;
