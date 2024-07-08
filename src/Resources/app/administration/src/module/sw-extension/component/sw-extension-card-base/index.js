import template from './sw-extension-card-base.html.twig';
import './sw-extension-card-base.scss';

import deDE from './snippet/de-DE';
import enGB from './snippet/en-GB';


const { Component, Context, Mixin } = Shopware;
const { Criteria } = Shopware.Data;

Shopware.Component.override('sw-extension-card-base', {
    template,
    inheritAttrs: false,

    inject: ['PluginDownloadService'],
    mixins: [Mixin.getByName('notification'),'sw-extension-error'],

    data() {
        return {
            isDownloadLoading: false
        };
    },

    methods: {
        async requestDownload() {
            this.isDownloadLoading = true;


            try {
                
                const accessToken = await this.PluginDownloadService
                .requestDownloadToken(this.extension.localId)
                .catch(() => null);

                if (accessToken) {
                    this.PluginDownloadService.requestDownload(this.extension.localId, accessToken);
                } else {
                    this.createNotificationError({
                        title: 'Unexpected error',
                        message: 'Could not generate access token for extension download',
                    });
                }
            } catch (e) {
                this.showExtensionErrors(e);
            } finally {
                this.isDownloadLoading = false;
            }
        },
    },
    
    snippets: {
        'de-DE': deDE,
        'en-GB': enGB,
    }
});