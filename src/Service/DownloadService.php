<?php

declare(strict_types=1);

namespace SloxDwn\Service;

use League\Flysystem\Filesystem;
use Psr\Log\LoggerInterface;
use Shopware\Core\Framework\App\AppEntity;
use Shopware\Core\Framework\Plugin\PluginEntity;
use Shopware\Core\Framework\Uuid\Uuid;
use Symfony\Component\Finder\Finder;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Exception;
use SplFileInfo;
use ZipArchive;

class DownloadService
{


    /** @var string */
    private $temp_baseDir_for_zip = 'temp_SloxDwn';

    public function __construct(
        private readonly LoggerInterface $logger,
        private readonly string $projectDir,
        private readonly Filesystem $filesystem
    ) {

        if ($this->filesystem->has($this->temp_baseDir_for_zip) === false) {
            $this->filesystem->createDirectory($this->temp_baseDir_for_zip);
        }
    }

    /**
     * @param PluginEntity|AppEntity $extension
     *
     * @throws \RuntimeException
     */
    public function download($extension): StreamedResponse
    {
        $extensionPath = $this->projectDir . '/' . $extension->getPath();
        $zipFilename = Uuid::randomHex() . '.zip';
        $zipDownloadFilename = \sprintf('%s-%s.zip', $extension->getName(), $extension->getVersion());
        $zipFilepathRelative = $this->temp_baseDir_for_zip . '/' . $zipFilename;
        $zipFilepathAbsolute = $this->getAbsolutePath($zipFilepathRelative);
        $zipArchive = new ZipArchive();

        if ($zipArchive->open($zipFilepathAbsolute, ZipArchive::CREATE|ZipArchive::OVERWRITE)) {
            $this->addDirectoryToZip($zipArchive, $extensionPath,$extension->getName());
            $zipArchive->close();
        }
        $response = new StreamedResponse(function () use ($zipFilepathRelative) {
            $stream = $this->filesystem->readStream($zipFilepathRelative);
            if ($stream === false) {
                $this->filesystem->delete($zipFilepathRelative);
                throw new Exception('Could not load file stream');
            }

            \fpassthru($stream);
            \fclose($stream);

            $this->filesystem->delete($zipFilepathRelative);
        });

        $response->headers->set('Content-Type', 'application/octet-stream');
        $response->headers->set('Content-Disposition', $response->headers->makeDisposition(
            ResponseHeaderBag::DISPOSITION_ATTACHMENT,
            $zipDownloadFilename
        ));

        return $response;
    }

    private function addDirectoryToZip(ZipArchive $zipArchive, string $dirpath, string $pluginName): void
    {
        /** @var SplFileInfo $file */
        foreach ((new Finder())->directories()->in($dirpath) as $directory) {
            $relativePath = \str_replace($dirpath, '', $directory->getPathname());
            $relativePath = $pluginName . '/' . $relativePath;
            $zipArchive->addEmptyDir($relativePath);
        }

        /** @var SplFileInfo $file */
        foreach ((new Finder())->files()->in($dirpath) as $file) {
            $relativePath = \str_replace($dirpath, '', $file->getPathname());
            $relativePath = $pluginName . '/' . $relativePath;
            $zipArchive->addFile($file->getPathname(), $relativePath);
        }
    }
    private function getAbsolutePath(string $relativePath): string {
        return \sprintf('%s/files/%s', $this->projectDir, $relativePath);
    }

    public function getTempBaseDirForZip(): string
    {
        return $this->temp_baseDir_for_zip;
    }
}




