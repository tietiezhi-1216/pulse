import React from 'react';
import { IconAlertTriangle } from '@tabler/icons';
import { useDispatch, useSelector } from 'react-redux';
import find from 'lodash/find';
import { closeTabs } from 'providers/ReduxStore/slices/collections/actions';
import { NON_CLOSABLE_TAB_TYPES } from 'providers/ReduxStore/slices/tabs';
import Button from 'ui/Button';
import { useTheme } from 'providers/Theme';
import { useTranslation } from 'react-i18next';

class TabPanelErrorBoundaryInner extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[TabPanelErrorBoundary] Unexpected render error:', error, errorInfo);
  }

  render() {
    const { t, theme } = this.props;

    if (this.state.hasError) {
      const { isClosable, onClose } = this.props;
      const errorMessage = this.state.error?.message;

      return (
        <div className="h-full flex flex-col items-center justify-center gap-3 px-6 text-center">
          <IconAlertTriangle size={36} strokeWidth={1.5} style={{ color: theme?.status?.warning?.text }} />
          <h2 className="text-lg font-medium">{t('REQUEST_PANEL.ERRORS.SOMETHING_WENT_WRONG')}</h2>
          {isClosable ? (
            <p className="text-sm opacity-70 max-w-md">
              {t('REQUEST_PANEL.ERRORS.TAB_ERROR_CLOSABLE')}
            </p>
          ) : (
            <p className="text-sm opacity-70 max-w-md">
              {t('REQUEST_PANEL.ERRORS.TAB_ERROR_PANEL')}
            </p>
          )}
          {errorMessage && (
            <p className="text-xs font-mono opacity-50 max-w-md break-all">{errorMessage}</p>
          )}
          {isClosable && (
            <Button size="md" data-testid="tab-panel-error-boundary-close-tab" color="primary" onClick={onClose}>
              {t('REQUEST_PANEL.ERRORS.CLOSE_TAB')}
            </Button>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

const TabPanelErrorBoundary = ({ tabUid, children }) => {
  const dispatch = useDispatch();
  const tabs = useSelector((state) => state.tabs.tabs);
  const focusedTab = find(tabs, (t) => t.uid === tabUid);
  const isClosable = !focusedTab || !NON_CLOSABLE_TAB_TYPES.includes(focusedTab.type);
  const { theme } = useTheme();
  const { t } = useTranslation();

  const handleClose = () => {
    dispatch(closeTabs({ tabUids: [tabUid] }));
  };

  return (
    <TabPanelErrorBoundaryInner isClosable={isClosable} onClose={handleClose} t={t} theme={theme}>
      {children}
    </TabPanelErrorBoundaryInner>
  );
};

export default TabPanelErrorBoundary;
