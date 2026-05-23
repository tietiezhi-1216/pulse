import React from 'react';
import { getTotalRequestCountInCollection } from 'utils/collections/';
import { IconFolder, IconWorld, IconApi, IconShare, IconBook } from '@tabler/icons';
import { areItemsLoading, getItemsLoadStats } from 'utils/collections/index';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ShareCollection from 'components/ShareCollection/index';
import GenerateDocumentation from 'components/Sidebar/Collections/Collection/GenerateDocumentation';
import { addTab } from 'providers/ReduxStore/slices/tabs';
import StyledWrapper from './StyledWrapper';
import { useTranslation } from 'react-i18next';

const Info = ({ collection }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const totalRequestsInCollection = getTotalRequestCountInCollection(collection);

  const isCollectionLoading = areItemsLoading(collection);
  const { loading: itemsLoadingCount, total: totalItems } = getItemsLoadStats(collection);
  const [showShareCollectionModal, toggleShowShareCollectionModal] = useState(false);
  const [showGenerateDocumentationModal, setShowGenerateDocumentationModal] = useState(false);

  const globalEnvironments = useSelector((state) => state.globalEnvironments.globalEnvironments);

  const collectionEnvironmentCount = collection.environments?.length || 0;
  const globalEnvironmentCount = globalEnvironments?.length || 0;
  const requestSummary = isCollectionLoading
    ? t('COLLECTION_SETTINGS.OVERVIEW.REQUESTS_LOADED', {
        loaded: totalItems - itemsLoadingCount,
        total: totalItems
      })
    : t(
        totalRequestsInCollection === 1
          ? 'COLLECTION_SETTINGS.OVERVIEW.REQUEST_COUNT_ONE'
          : 'COLLECTION_SETTINGS.OVERVIEW.REQUEST_COUNT_OTHER',
        { count: totalRequestsInCollection }
      );

  const handleToggleShowShareCollectionModal = (value) => (e) => {
    toggleShowShareCollectionModal(value);
  };

  return (
    <StyledWrapper className="w-full flex flex-col h-fit">
      <div className="rounded-lg py-6">
        <div className="grid gap-5">
          {/* Location Row */}
          <div className="flex items-start">
            <div className="icon-box location flex-shrink-0 p-3 rounded-lg">
              <IconFolder className="w-5 h-5" stroke={1.5} />
            </div>
            <div className="ml-4">
              <div className="font-medium">{t('COLLECTION_SETTINGS.OVERVIEW.LOCATION')}</div>
              <div className="mt-1 text-muted break-all">
                {collection.pathname}
              </div>
            </div>
          </div>

          {/* Environments Row */}
          <div className="flex items-start">
            <div className="icon-box environments flex-shrink-0 p-3 rounded-lg">
              <IconWorld className="w-5 h-5" stroke={1.5} />
            </div>
            <div className="ml-4">
              <div className="font-medium">{t('COMMON.ENVIRONMENTS')}</div>
              <div className="mt-1 flex flex-col gap-1">
                <button
                  type="button"
                  className="text-link cursor-pointer hover:underline text-left bg-transparent"
                  onClick={() => {
                    dispatch(
                      addTab({
                        uid: `${collection.uid}-environment-settings`,
                        collectionUid: collection.uid,
                        type: 'environment-settings'
                      })
                    );
                  }}
                >
                  {t(
                    collectionEnvironmentCount === 1
                      ? 'COLLECTION_SETTINGS.OVERVIEW.COLLECTION_ENVIRONMENT_COUNT_ONE'
                      : 'COLLECTION_SETTINGS.OVERVIEW.COLLECTION_ENVIRONMENT_COUNT_OTHER',
                    { count: collectionEnvironmentCount }
                  )}
                </button>
                <button
                  type="button"
                  className="text-link cursor-pointer hover:underline text-left bg-transparent"
                  onClick={() => {
                    dispatch(
                      addTab({
                        uid: `${collection.uid}-global-environment-settings`,
                        collectionUid: collection.uid,
                        type: 'global-environment-settings'
                      })
                    );
                  }}
                >
                  {t(
                    globalEnvironmentCount === 1
                      ? 'COLLECTION_SETTINGS.OVERVIEW.GLOBAL_ENVIRONMENT_COUNT_ONE'
                      : 'COLLECTION_SETTINGS.OVERVIEW.GLOBAL_ENVIRONMENT_COUNT_OTHER',
                    { count: globalEnvironmentCount }
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Requests Row */}
          <div className="flex items-start">
            <div className="icon-box requests flex-shrink-0 p-3 rounded-lg">
              <IconApi className="w-5 h-5" stroke={1.5} />
            </div>
            <div className="ml-4">
              <div className="font-medium">{t('COLLECTION_SETTINGS.OVERVIEW.REQUESTS')}</div>
              <div className="mt-1 text-muted">
                {requestSummary}
              </div>
            </div>
          </div>

          <div className="flex items-start group cursor-pointer" onClick={handleToggleShowShareCollectionModal(true)}>
            <div className="icon-box share flex-shrink-0 p-3 rounded-lg">
              <IconShare className="w-5 h-5" stroke={1.5} />
            </div>
            <div className="ml-4 h-full flex flex-col justify-start">
              <div className="font-medium h-fit my-auto">{t('COMMON.SHARE')}</div>
              <div className="group-hover:underline text-link">
                {t('COLLECTION_SETTINGS.OVERVIEW.SHARE_COLLECTION')}
              </div>
            </div>
          </div>
          {showShareCollectionModal && <ShareCollection collectionUid={collection.uid} onClose={handleToggleShowShareCollectionModal(false)} />}

          <div className="flex items-start group cursor-pointer" onClick={() => setShowGenerateDocumentationModal(true)}>
            <div className="icon-box generate-docs flex-shrink-0 p-3 rounded-lg">
              <IconBook className="w-5 h-5" stroke={1.5} />
            </div>
            <div className="ml-4 h-full flex flex-col justify-start">
              <div className="font-medium h-fit my-auto">{t('COMMON.DOCUMENTATION')}</div>
              <div className="group-hover:underline text-link">
                {t('COLLECTION_SETTINGS.OVERVIEW.GENERATE_DOCS')}
              </div>
            </div>
          </div>
          {showGenerateDocumentationModal && <GenerateDocumentation collectionUid={collection.uid} onClose={() => setShowGenerateDocumentationModal(false)} />}
        </div>
      </div>
    </StyledWrapper>
  );
};

export default Info;
