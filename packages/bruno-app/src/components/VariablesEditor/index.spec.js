import '@testing-library/jest-dom';
import React from 'react';
import { act, cleanup, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import i18n from '../../i18n';
import VariablesEditor from './index';

jest.mock('providers/Theme', () => ({
  useTheme: () => ({
    displayedTheme: 'light',
    theme: {
      text: {
        base: '#111'
      }
    }
  })
}));

jest.mock('react-inspector', () => ({
  Inspector: ({ data }) => <span>{String(data)}</span>,
  chromeDark: {},
  chromeLight: {}
}));

describe('VariablesEditor i18n', () => {
  const theme = {
    bg: '#fff',
    table: {
      border: '#ddd'
    },
    colors: {
      text: {
        muted: '#777'
      }
    }
  };

  afterEach(async () => {
    cleanup();
    await act(async () => {
      await i18n.changeLanguage('en');
    });
  });

  it('renders empty variable states in Simplified Chinese', async () => {
    await act(async () => {
      await i18n.changeLanguage('zh-CN');
    });

    render(
      <ThemeProvider theme={theme}>
        <VariablesEditor
          collection={{
            environments: [],
            runtimeVariables: {}
          }}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('运行时变量')).toBeInTheDocument();
    expect(screen.getByText('未找到运行时变量')).toBeInTheDocument();
    expect(screen.getByText('环境变量')).toBeInTheDocument();
    expect(screen.getByText('未选择环境')).toBeInTheDocument();
  });
});
