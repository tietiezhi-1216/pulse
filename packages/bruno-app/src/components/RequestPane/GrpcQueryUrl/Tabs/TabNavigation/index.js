import React from 'react';
import StyledWrapper from './StyledWrapper';
import { useTranslation } from 'react-i18next';

const TabNavigation = ({ activeTab, onTabChange, collectionProtoFiles, collectionImportPaths }) => {
  const { t } = useTranslation();

  return (
    <StyledWrapper className="px-3 py-2 border-b border-neutral-200 dark:border-neutral-700">
      <div className="tab-container flex space-x-1 rounded-lg p-1">
        <button
          className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors tab-button ${activeTab === 'protofiles' ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onTabChange('protofiles');
          }}
        >
          {t('COLLECTION_SETTINGS.PROTOBUF.PROTO_FILES', { count: collectionProtoFiles?.length || 0 })}
        </button>
        <button
          className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors tab-button ${activeTab === 'importpaths' ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onTabChange('importpaths');
          }}
        >
          {t('COLLECTION_SETTINGS.PROTOBUF.IMPORT_PATHS', { count: collectionImportPaths?.length || 0 })}
        </button>
      </div>
    </StyledWrapper>
  );
};

export default TabNavigation;
