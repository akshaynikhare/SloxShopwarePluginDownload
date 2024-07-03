import PluginDownloadService from './service/api/plugin-download.api.service';

Shopware.Service().register('PluginDownloadService', () => {
    return new PluginDownloadService(
        Shopware.Application.getContainer('init').httpClient,
        Shopware.Service('loginService')
    );
});