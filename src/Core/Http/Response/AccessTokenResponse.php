<?php

declare(strict_types=1);

namespace SloxDwn\Core\Http\Response;

use Symfony\Component\HttpFoundation\JsonResponse;

class AccessTokenResponse extends JsonResponse
{
    public function __construct(string $jwtToken)
    {
        parent::__construct(['accessToken' => $jwtToken]);
    }
}
