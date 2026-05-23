import React, { useRef, forwardRef } from 'react';
import { IconCaretDown } from '@tabler/icons';
import Dropdown from 'components/Dropdown';
import { humanizeRequestBodyMode } from 'utils/collections';
import StyledWrapper from './StyledWrapper';
import { useTranslation } from 'react-i18next';

const RAW_MODES = [
  {
    labelKey: 'BODY_MODES.JSON',
    key: 'json'
  },
  {
    labelKey: 'BODY_MODES.XML',
    key: 'xml'
  },
  {
    labelKey: 'BODY_MODES.TEXT',
    key: 'text'
  }
];

const WSRequestBodyMode = ({ mode, onModeChange }) => {
  const dropdownTippyRef = useRef();
  const { t } = useTranslation();
  const onDropdownCreate = (ref) => (dropdownTippyRef.current = ref);

  const Icon = forwardRef((props, ref) => {
    return (
      <div ref={ref} className="flex items-center justify-center pl-3 py-1 select-none selected-body-mode">
        {humanizeRequestBodyMode(mode, t)}
        {' '}
        <IconCaretDown className="caret ml-2" size={14} strokeWidth={2} />
      </div>
    );
  });

  return (
    <StyledWrapper>
      <div className="inline-flex items-center cursor-pointer body-mode-selector">
        <Dropdown onCreate={onDropdownCreate} icon={<Icon />} placement="bottom-end">
          <div className="label-item font-medium">{t('BODY_MODES.GROUPS.RAW')}</div>
          {RAW_MODES.map((d) => (
            <div
              className="dropdown-item"
              key={d.key}
              onClick={() => {
                dropdownTippyRef.current.hide();
                onModeChange(d.key);
              }}
            >
              {t(d.labelKey)}
            </div>
          ))}
        </Dropdown>
      </div>
    </StyledWrapper>
  );
};
export default WSRequestBodyMode;
