import React, { useMemo, useCallback } from 'react';
import get from 'lodash/get';
import {
  IconCaretDown,
  IconForms,
  IconBraces,
  IconCode,
  IconFileText,
  IconDatabase,
  IconFile,
  IconX
} from '@tabler/icons';
import MenuDropdown from 'ui/MenuDropdown';
import { useDispatch } from 'react-redux';
import { updateRequestBodyMode } from 'providers/ReduxStore/slices/collections';
import { humanizeRequestBodyMode } from 'utils/collections';
import StyledWrapper from './StyledWrapper';
import { updateRequestBody } from 'providers/ReduxStore/slices/collections/index';
import { toastError } from 'utils/common/error';
import { prettifyJsonString } from 'utils/common/index';
import xmlFormat from 'xml-formatter';
import { useTranslation } from 'react-i18next';

const DEFAULT_MODES = [
  {
    nameKey: 'BODY_MODES.GROUPS.FORM',
    options: [
      { id: 'multipartForm', labelKey: 'BODY_MODES.MULTIPART_FORM', leftSection: IconForms },
      { id: 'formUrlEncoded', labelKey: 'BODY_MODES.FORM_URL_ENCODED', leftSection: IconForms }
    ]
  },
  {
    nameKey: 'BODY_MODES.GROUPS.RAW',
    options: [
      { id: 'json', labelKey: 'BODY_MODES.JSON', leftSection: IconBraces },
      { id: 'xml', labelKey: 'BODY_MODES.XML', leftSection: IconCode },
      { id: 'text', labelKey: 'BODY_MODES.TEXT', leftSection: IconFileText },
      { id: 'sparql', labelKey: 'BODY_MODES.SPARQL', leftSection: IconDatabase }
    ]
  },
  {
    nameKey: 'BODY_MODES.GROUPS.OTHER',
    options: [
      { id: 'file', labelKey: 'BODY_MODES.FILE_BINARY', leftSection: IconFile },
      { id: 'none', labelKey: 'BODY_MODES.NO_BODY', leftSection: IconX }
    ]
  }
];

const RequestBodyMode = ({ item, collection }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const body = item.draft ? get(item, 'draft.request.body') : get(item, 'request.body');
  const bodyMode = body?.mode;

  const onModeChange = useCallback((value) => {
    dispatch(
      updateRequestBodyMode({
        itemUid: item.uid,
        collectionUid: collection.uid,
        mode: value
      })
    );
  }, [dispatch, item.uid, collection.uid]);

  const onPrettify = () => {
    if (body?.json && bodyMode === 'json') {
      try {
        const prettyBodyJson = prettifyJsonString(body.json);
        dispatch(
          updateRequestBody({
            content: prettyBodyJson,
            itemUid: item.uid,
            collectionUid: collection.uid
          })
        );
      } catch (e) {
        toastError(new Error(t('REQUEST.PRETTIFY_INVALID_JSON')));
      }
    } else if (body?.xml && bodyMode === 'xml') {
      try {
        const prettyBodyXML = xmlFormat(body.xml, { collapseContent: true });
        dispatch(
          updateRequestBody({
            content: prettyBodyXML,
            itemUid: item.uid,
            collectionUid: collection.uid
          })
        );
      } catch (e) {
        toastError(new Error(t('REQUEST.PRETTIFY_INVALID_XML')));
      }
    }
  };

  const menuItems = useMemo(() => {
    return DEFAULT_MODES.map((group) => ({
      ...group,
      name: t(group.nameKey),
      options: group.options.map((option) => ({
        ...option,
        label: t(option.labelKey),
        onClick: () => onModeChange(option.id)
      }))
    }));
  }, [onModeChange, t]);

  return (
    <StyledWrapper>
      <div className="inline-flex items-center cursor-pointer body-mode-selector" data-testid="request-body-mode-selector">
        <MenuDropdown
          items={menuItems}
          placement="bottom-end"
          selectedItemId={bodyMode}
          showGroupDividers={false}
          groupStyle="select"
        >
          <div className="flex items-center justify-center pl-3 py-1 select-none selected-body-mode">
            {humanizeRequestBodyMode(bodyMode, t)} <IconCaretDown className="caret ml-1" size={14} strokeWidth={2} />
          </div>
        </MenuDropdown>
      </div>
      {(bodyMode === 'json' || bodyMode === 'xml') && (
        <button className="ml-2" onClick={onPrettify}>
          {t('REQUEST_PANEL.ACTIONS.PRETTIFY')}
        </button>
      )}
    </StyledWrapper>
  );
};
export default RequestBodyMode;
