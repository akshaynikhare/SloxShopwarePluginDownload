<?php declare(strict_types=1);

namespace SloxDwn\Storefront\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Shopware\Core\Framework\App\AppEntity;
use Shopware\Core\Framework\Plugin\PluginEntity;
use Shopware\Core\Framework\Log\Package;
use Shopware\Core\Framework\Context;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use SloxDwn\Core\Http\Response\AccessTokenResponse;
use SloxDwn\Service\TokenFactory;
use SloxDwn\Service\DownloadService;


#[Route(defaults: ['_routeScope' => ['store-api']])]
#[Package('administration')]
class DownloadController extends AbstractController
{

    public function __construct(
        private readonly EntityRepository $pluginRepository,
        private readonly EntityRepository $appRepository,
        private readonly DownloadService $downloadService,
        private readonly TokenFactory $tokenFactory,
    ) {
    }

    #[Route(
        path: '/api/_action/sloxdwn/{extensionId}/request-download-token',
        name: 'api.sloxdwn.request-download-token',
        defaults: ['auth_required' => true, '_routeScope' => ['administration']],
        methods: ['POST'])]
    public function requestDownloadToken(string $extensionId, Request $request): Response
    {
        $accessToken = $this->tokenFactory->generateAccessToken($extensionId);

        return new AccessTokenResponse($accessToken);
    }


    #[Route(
        path: '/api/_admin/sloxdwn/{extensionId}/request-download',
        name: 'sloxdwn.request-download',
        defaults: ['auth_required' => false, '_routeScope' => ['administration']],
        methods: ['GET']
    )]
    public function requestDownload(string $extensionId, Request $request): Response
    {

        $accessToken = (string) $request->query->get('accessToken');
        $this->tokenFactory->validateAccessToken($accessToken, $extensionId);

        /** @var ?PluginEntity */
        $extension = $this->pluginRepository
            ->search(new Criteria([$extensionId]), Context::createDefaultContext())
            ->get($extensionId);

        if ($extension === null) {
            /** @var ?AppEntity */
            $extension = $this->appRepository
                ->search(new Criteria([$extensionId]), Context::createDefaultContext())
                ->get($extensionId);
        }


        if ($extension === null) {
            throw new NotFoundHttpException(\sprintf('Extension with ID %s not found', $extensionId));
        }

        try {
            return $this->downloadService->download($extension);
        } catch (\RuntimeException $e) {
            if (($logger = $this->container->get('logger'))) {
                $logger->error($e);
            }

            throw new HttpException(500, 'Failed to download extension as zip');
        }

    }

}
