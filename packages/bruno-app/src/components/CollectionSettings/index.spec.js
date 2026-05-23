import '@testing-library/jest-dom';
import React from 'react';
import { act, cleanup, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import i18n from '../../i18n';
import CollectionSettings from './index';

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn()
}));

jest.mock('./Overview/index', () => () => <div />);
jest.mock('./Headers', () => () => <div />);
jest.mock('./Vars/index', () => () => <div />);
jest.mock('./Auth', () => () => <div />);
jest.mock('./Script', () => () => <div />);
jest.mock('./Tests', () => () => <div />);
jest.mock('./Presets', () => () => <div />);
jest.mock('./ProxySettings', () => () => <div />);
jest.mock('./ClientCertSettings', () => () => <div />);
jest.mock('./Protobuf', () => () => <div />);

describe('CollectionSettings i18n', () => {
  const theme = {
    bg: '#111',
    primary: {
      solid: '#f5c542'
    },
    tabs: {
      marginRight: '16px',
      active: {
        color: '#fff',
        border: '#f5c542',
        fontWeight: 600
      }
    },
    table: {
      border: '#333'
    },
    colors: {
      text: {
        muted: '#777',
        subtext0: '#aaa'
      }
    }
  };

  const collection = {
    uid: 'collection-1',
    settingsSelectedTab: 'overview',
    root: {
      request: {
        headers: [],
        vars: {
          req: [],
          res: []
        },
        auth: {
          mode: 'none'
        }
      }
    },
    brunoConfig: {}
  };

  afterEach(async () => {
    cleanup();
    await act(async () => {
      await i18n.changeLanguage('en');
    });
  });

  it('renders collection settings tabs in Simplified Chinese', async () => {
    await act(async () => {
      await i18n.changeLanguage('zh-CN');
    });

    render(
      <ThemeProvider theme={theme}>
        <CollectionSettings collection={collection} />
      </ThemeProvider>
    );

    expect(screen.getByText('概览')).toBeInTheDocument();
    expect(screen.getByText('请求头')).toBeInTheDocument();
    expect(screen.getByText('变量')).toBeInTheDocument();
    expect(screen.getByText('认证')).toBeInTheDocument();
    expect(screen.getByText('脚本')).toBeInTheDocument();
    expect(screen.getByText('测试')).toBeInTheDocument();
    expect(screen.getByText('预设')).toBeInTheDocument();
    expect(screen.getByText('代理')).toBeInTheDocument();
    expect(screen.getByText('客户端证书')).toBeInTheDocument();
    expect(screen.getByText('Protobuf')).toBeInTheDocument();
  });
});
