const { ApiService } = Shopware.Classes;
const { Context } = Shopware;

export default class PluginDownloadService extends ApiService {
    constructor(httpClient, loginService, apiEndpoint = 'sloxdwn') {
        super(httpClient, loginService, apiEndpoint);

        this.name = 'sloxdwn';
    }

    /**
     * @param {string} extensionId
     *
     * @returns {Promise<string|undefined>}
     */
    async requestDownloadToken(extensionId) {
        const url = `/_action/${this.apiEndpoint}/${extensionId}/request-download-token`;
        const headers = this.getBasicHeaders();

        return await this.httpClient.post(url, { }, { headers }).then((res) => res?.data?.accessToken);
    }

    /**
     * @param {string} extensionId
     * @param {string} accessToken
     */
    requestDownload(extensionId, accessToken) {
        const params = new URLSearchParams({ accessToken });
        const url = Context.api.apiPath + `/_admin/${this.apiEndpoint}/${extensionId}/request-download?${params.toString()}`;

        window.open(url, '_blank');
    }
}
