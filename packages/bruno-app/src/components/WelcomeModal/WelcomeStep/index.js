import React from 'react';
import {
  IconFolder as IconFolderTabler,
  IconGitFork,
  IconLock,
  IconRocket
} from '@tabler/icons';
import { useTranslation } from 'react-i18next';
import StyledWrapper from './StyledWrapper';

const highlights = [
  {
    icon: IconFolderTabler,
    titleKey: 'WELCOME_MODAL.HIGHLIGHTS.FILESYSTEM_TITLE',
    descKey: 'WELCOME_MODAL.HIGHLIGHTS.FILESYSTEM_DESC'
  },
  {
    icon: IconGitFork,
    titleKey: 'WELCOME_MODAL.HIGHLIGHTS.GIT_TITLE',
    descKey: 'WELCOME_MODAL.HIGHLIGHTS.GIT_DESC'
  },
  {
    icon: IconLock,
    titleKey: 'WELCOME_MODAL.HIGHLIGHTS.PRIVACY_TITLE',
    descKey: 'WELCOME_MODAL.HIGHLIGHTS.PRIVACY_DESC'
  },
  {
    icon: IconRocket,
    titleKey: 'WELCOME_MODAL.HIGHLIGHTS.FAST_TITLE',
    descKey: 'WELCOME_MODAL.HIGHLIGHTS.FAST_DESC'
  }
];

const WelcomeStep = () => {
  const { t } = useTranslation();

  return (
    <StyledWrapper className="step-body">
      <div className="highlights">
        {highlights.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.titleKey} className="highlight-item">
              <div className="highlight-icon">
                <Icon size={18} stroke={1.5} />
              </div>
              <div>
                <div className="highlight-title">{t(item.titleKey)}</div>
                <div className="highlight-desc">{t(item.descKey)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </StyledWrapper>
  );
};

export default WelcomeStep;
