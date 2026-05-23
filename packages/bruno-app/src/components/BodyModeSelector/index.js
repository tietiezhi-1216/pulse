import React, { useMemo } from 'react';
import { IconCaretDown, IconForms, IconBraces, IconCode, IconFileText, IconDatabase, IconFile, IconX } from '@tabler/icons';
import MenuDropdown from 'ui/MenuDropdown';
import { humanizeRequestBodyMode } from 'utils/collections';
import StyledWrapper from './StyledWrapper';
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

const BodyModeSelector = ({
  currentMode,
  onModeChange,
  modes = DEFAULT_MODES,
  disabled = false,
  className = '',
  wrapperClassName = '',
  placement = 'bottom-end'
}) => {
  const { t } = useTranslation();

  // Add onClick handlers to mode options
  const menuItems = useMemo(() => {
    return modes.map((group) => ({
      ...group,
      name: group.nameKey ? t(group.nameKey) : group.name,
      options: group.options.map((option) => ({
        ...option,
        label: option.labelKey ? t(option.labelKey) : option.label,
        onClick: () => onModeChange(option.id)
      }))
    }));
  }, [modes, onModeChange, t]);

  return (
    <StyledWrapper className={wrapperClassName}>
      <div className={`inline-flex items-center body-mode-selector ${disabled ? 'cursor-default' : 'cursor-pointer'}`}>
        <MenuDropdown
          items={menuItems}
          placement={placement}
          disabled={disabled}
          className={className}
          selectedItemId={currentMode}
          showGroupDividers={false}
          groupStyle="select"
        >
          <div className="flex items-center justify-center pl-3 py-1 select-none selected-body-mode">
            {humanizeRequestBodyMode(currentMode, t)}
            {' '}
            <IconCaretDown className="caret ml-2" size={14} strokeWidth={2} />
          </div>
        </MenuDropdown>
      </div>
    </StyledWrapper>
  );
};

export default BodyModeSelector;
