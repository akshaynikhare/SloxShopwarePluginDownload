<?php

declare(strict_types=1);

namespace SloxDwn\Service;

use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\UnencryptedToken;
use Shopware\Core\Framework\Uuid\Uuid;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class TokenFactory
{
    private const ACCESS_TOKEN_EXPIRATION_SECONDS = 10;

    public function __construct(
        private readonly Configuration $configuration
    ) {

    }

    public function generateAccessToken(string $extensionId): string
    {
        $expires = new \DateTimeImmutable('+' . self::ACCESS_TOKEN_EXPIRATION_SECONDS . ' seconds');

        return $this->configuration->builder()
            ->identifiedBy(Uuid::randomHex())
            ->issuedAt(new \DateTimeImmutable())
            ->canOnlyBeUsedAfter(new \DateTimeImmutable())
            ->withClaim('extensionId', $extensionId)
            ->expiresAt($expires)
            ->getToken($this->configuration->signer(), $this->configuration->signingKey())
            ->toString();
    }

    public function validateAccessToken(string $accessToken, string $extensionId): void
    {
        $accessToken = $this->configuration->parser()->parse($accessToken);

        if (!($accessToken instanceof UnencryptedToken)) {
            throw new BadRequestHttpException('Invalid token');
        }

        if ($accessToken->isExpired(new \DateTimeImmutable())) {
            throw new UnauthorizedHttpException('json', 'Expired token');
        }

        if ($accessToken->claims()->get('extensionId') !== $extensionId) {
            throw new UnauthorizedHttpException('json', 'Invalid plugin claim');
        }
    }
}
