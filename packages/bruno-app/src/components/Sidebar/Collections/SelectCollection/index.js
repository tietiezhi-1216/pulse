import React from 'react';
import Modal from 'components/Modal/index';
import { IconFiles } from '@tabler/icons';
import { useSelector } from 'react-redux';
import StyledWrapper from './StyledWrapper';
import { useTranslation } from 'react-i18next';

const SelectCollection = ({ onClose, onSelect, title }) => {
  const { t } = useTranslation();
  const { collections } = useSelector((state) => state.collections);

  return (
    <StyledWrapper>
      <Modal size="sm" title={title || t('COLLECTIONS_LIST.SELECT_COLLECTION')} hideFooter={true} handleCancel={onClose}>
        <ul className="mb-2">
          {collections && collections.length ? (
            collections.map((c) => (
              <div className="collection" key={c.uid} onClick={() => onSelect(c.uid)}>
                <IconFiles size={18} strokeWidth={1.5} /> <span className="ml-2">{c.name}</span>
              </div>
            ))
          ) : (
            <div>{t('GLOBAL_SEARCH.NO_COLLECTIONS')}</div>
          )}
        </ul>
      </Modal>
    </StyledWrapper>
  );
};

export default SelectCollection;
