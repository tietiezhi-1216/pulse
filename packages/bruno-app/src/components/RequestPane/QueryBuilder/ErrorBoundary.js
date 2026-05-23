import React from 'react';
import { IconAlertTriangle } from '@tabler/icons';
import StyledWrapper from './StyledWrapper';
import Button from 'ui/Button/index';
import { Translation } from 'react-i18next';

class QueryBuilderErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
    this.reset = this.reset.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[QueryBuilder] Unexpected render error:', error, errorInfo);
  }

  reset() {
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Translation>
          {(t) => (
            <StyledWrapper>
              <div className="schema-empty-state">
                <IconAlertTriangle size={32} strokeWidth={1.5} className="empty-state-icon warning" />
                <div className="empty-state-title">{t('REQUEST_PANEL.ERRORS.SOMETHING_WENT_WRONG')}</div>
                <div className="empty-state-description">
                  {t('REQUEST_PANEL.QUERY_BUILDER.UNEXPECTED_ERROR')}
                </div>
                <Button color="secondary" onClick={this.reset}>
                  {t('COMMON.TRY_AGAIN')}
                </Button>
              </div>
            </StyledWrapper>
          )}
        </Translation>
      );
    }
    return this.props.children;
  }
}

export default QueryBuilderErrorBoundary;
