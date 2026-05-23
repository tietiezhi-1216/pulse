import '@testing-library/jest-dom';
import React from 'react';
import { act, cleanup, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import i18n from '../../../i18n';
import ProtobufSettings from './index';

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn()
}));

jest.mock('../../../hooks/useProtoFileManagement', () => () => ({
  protoFiles: [],
  importPaths: [],
  addProtoFileToCollection: jest.fn(),
  addImportPathToCollection: jest.fn(),
  toggleImportPath: jest.fn(),
  browseForProtoFile: jest.fn(),
  browseForImportDirectory: jest.fn(),
  removeProtoFileFromCollection: jest.fn(),
  removeImportPathFromCollection: jest.fn(),
  replaceImportPathInCollection: jest.fn(),
  replaceProtoFileInCollection: jest.fn()
}));

describe('ProtobufSettings i18n', () => {
  const theme = {
    bg: '#111',
    text: '#eee',
    textLink: '#7cc4ff',
    primary: {
      solid: '#f5c542'
    },
    border: {
      radius: {
        base: '4px'
      }
    },
    dropdown: {
      hoverBg: '#222'
    },
    requestTabPanel: {
      url: {
        bg: '#161616'
      }
    },
    table: {
      border: '#333',
      thead: {
        color: '#aaa'
      }
    },
    font: {
      size: {
        sm: '14px',
        xs: '12px'
      }
    },
    button2: {
      color: {
        primary: {
          bg: '#f5c542',
          text: '#111',
          border: '#f5c542'
        }
      }
    },
    colors: {
      accent: '#f5c542',
      bg: {
        danger: '#ff4d4f'
      },
      text: {
        danger: '#ff4d4f',
        muted: '#777'
      }
    }
  };

  const collection = {
    uid: 'collection-1',
    pathname: '/tmp/collection'
  };

  afterEach(async () => {
    cleanup();
    await act(async () => {
      await i18n.changeLanguage('en');
    });
  });

  it('renders empty protobuf settings in Simplified Chinese', async () => {
    await act(async () => {
      await i18n.changeLanguage('zh-CN');
    });

    render(
      <ThemeProvider theme={theme}>
        <ProtobufSettings collection={collection} />
      </ThemeProvider>
    );

    expect(screen.getByText('Proto 文件 (0)')).toBeInTheDocument();
    expect(screen.getByText('文件')).toBeInTheDocument();
    expect(screen.getAllByText('路径')).toHaveLength(2);
    expect(screen.getAllByText('操作')).toHaveLength(2);
    expect(screen.getByText('未添加 Proto 文件')).toBeInTheDocument();
    expect(screen.getByText('导入路径 (0)')).toBeInTheDocument();
    expect(screen.getByText('目录')).toBeInTheDocument();
    expect(screen.getByText('未添加导入路径')).toBeInTheDocument();
    expect(screen.getByText('+ 添加 Proto 文件')).toBeInTheDocument();
    expect(screen.getByText('+ 添加导入路径')).toBeInTheDocument();
    expect(screen.getByText('保存')).toBeInTheDocument();
  });
});
