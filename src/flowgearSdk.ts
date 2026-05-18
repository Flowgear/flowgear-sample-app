/* eslint-disable @typescript-eslint/no-namespace */
enum ThemeMode {
    Dark = 'theme-dark',
    Light = 'theme-light',
}

enum FgThemes {
    Dark = 'dark-theme',
    Light = 'light-theme',
    Dark_CI = 'dark-theme-ci',
    Light_CI = 'light-theme-ci',
}

export namespace Flowgear {
    export namespace Sdk {
        interface FgSdkMessage {
            messageId: number;
            name: string;
            parameters: Record<string, unknown>;
            result: unknown;
        }

        export enum ConfirmResult {
            Yes,
            No,
        }

        export enum GetTextResult {
            Ok,
            Cancel,
        }

        export enum AlertMessageTypes {
            Info,
            Warning,
            Error,
            Success,
            Help,
            Running,
        }

        export enum AlertDismissOptions {
            ViewChange,
            Auto,
            Tap,
        }

        let _lastMessageId = 0;
        const _awaitedResponses: Record<number, (result: unknown) => void> = {};

        window.addEventListener('message', (event: MessageEvent) => {
            const message = event.data as FgSdkMessage;
            if (!message.messageId) return;

            const callback = _awaitedResponses[message.messageId];
            delete _awaitedResponses[message.messageId];
            callback?.(message.result);
        });

        const sendMessage = <T = unknown>(
            name: string,
            parameters?: Record<string, unknown>
        ): Promise<T> =>
            new Promise((resolve: unknown) => {
                if (window.top == null || window.top === window) {
                    console.log(
                        "Message can't be sent - web app must run embedded into the Console."
                    );
                    return;
                }

                const messageId = ++_lastMessageId;
                _awaitedResponses[messageId] = resolve as (
                    result: unknown
                ) => void;
                window.top.postMessage(
                    {
                        messageId,
                        name,
                        parameters,
                    } satisfies Partial<FgSdkMessage>,
                    '*'
                );
            });

        export const init = async (): Promise<void> => {
            if (!window.location.protocol.includes('https')) {
                console.log('Flowgear Web Apps must be bound to https.');
            }

            if (window.top === window) {
                const debugUrl = `https://app.flowgear.net/#t-{tenant}/sites/{siteKey}/apps/debug/?debugUrl=${encodeURIComponent(window.location.toString())}`;
                console.log(
                    `This Flowgear Web App should run embedded in the Console. Use the following URL to debug: ${debugUrl}`
                );
            }

            const config: { consoleTheme: FgThemes; theme: ThemeMode } =
                await sendMessage<{ consoleTheme: FgThemes; theme: ThemeMode }>(
                    'getConfig'
                );

            if (config.consoleTheme) {
                document.body.setAttribute('data-theme', config.consoleTheme);
                document.body.classList.add(
                    config.consoleTheme === FgThemes.Dark_CI ||
                        config.consoleTheme === FgThemes.Dark
                        ? 'theme-dark'
                        : 'theme-light'
                );
            } else if (config.theme) {
                document.body.classList.add(config.theme);
                document.body.setAttribute(
                    'data-theme',
                    config.theme === ThemeMode.Dark
                        ? FgThemes.Dark_CI
                        : FgThemes.Light_CI
                );
            }
        };

        export const getContext = (): Promise<unknown> =>
            sendMessage('getContext', {});

        export const invoke = async <T>(
            method = 'GET',
            url: string,
            payload?: unknown,
            headers?: Record<string, string>,
            tenant?: string
        ): Promise<T> => {
            const response = await sendMessage<{
                success: boolean;
                error: unknown;
                response: T;
            }>('invoke', { method, url, payload, headers, tenant });
            if (!response.success) throw response.error;
            return response.response as T;
        };

        export const setAlert = (
            text: string,
            alertType: AlertMessageTypes,
            dismissOption: AlertDismissOptions
        ): Promise<unknown> =>
            sendMessage('setAlert', { text, alertType, dismissOption });

        export const confirmModal = async (
            title: string,
            description: string,
            confirmText: string
        ): Promise<ConfirmResult> => {
            const { result } = await sendMessage<{ result: ConfirmResult }>(
                'confirmModal',
                { title, description, confirmText }
            );
            return result;
        };

        export const getTextModal = async (
            title: string,
            description: string,
            defaultValue: string
        ): Promise<{ result: GetTextResult; text: string }> => {
            const { result } = await sendMessage<{
                result: { result: GetTextResult; text: string };
            }>('getTextModal', { title, description, defaultValue });
            return result;
        };

        export const openUrl = (
            url: string,
            target?: string
        ): Promise<unknown> => sendMessage('openUrl', { url, target });

        export const setParentPath = (
            path: string
        ): Promise<{ success: boolean }> =>
            sendMessage('pathChanged', { path });
    }
}
