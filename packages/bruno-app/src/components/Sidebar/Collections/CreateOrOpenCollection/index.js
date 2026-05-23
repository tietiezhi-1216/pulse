import { useTheme } from '../../../../providers/Theme';
import { useDispatch } from 'react-redux';
import { openCollection } from 'providers/ReduxStore/slices/collections/actions';

import toast from 'react-hot-toast';
import styled from 'styled-components';
import StyledWrapper from './StyledWrapper';
import { useTranslation } from 'react-i18next';

const LinkStyle = styled.span`
  color: ${(props) => props.theme['text-link']};
`;

const CreateOrOpenCollection = ({ onCreateClick }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleOpenCollection = () => {
    dispatch(openCollection()).catch(
      (err) => {
        console.log(err);
        toast.error(t('WORKSPACE.OPEN_COLLECTION_ERROR'));
      }
    );
  };
  const CreateLink = () => (
    <LinkStyle
      className="underline text-link cursor-pointer"
      theme={theme}
      onClick={onCreateClick}
    >
      {t('COMMON.CREATE')}
    </LinkStyle>
  );
  const OpenLink = () => (
    <LinkStyle className="underline text-link cursor-pointer" theme={theme} onClick={() => handleOpenCollection(true)}>
      {t('COMMON.OPEN')}
    </LinkStyle>
  );

  return (
    <StyledWrapper className="px-2 mt-4">
      <div className="text-xs text-center">
        <div>{t('GLOBAL_SEARCH.NO_COLLECTIONS')}</div>
        <div className="mt-2">
          <CreateLink /> {t('COMMON.OR')} <OpenLink /> {t('COMMON.COLLECTION')}.
        </div>
      </div>
    </StyledWrapper>
  );
};

export default CreateOrOpenCollection;
