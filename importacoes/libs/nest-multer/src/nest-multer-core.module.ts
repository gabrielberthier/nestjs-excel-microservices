import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import multer from 'fastify-multer';

@Module({})
export class NestCoreModule implements OnApplicationBootstrap {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost<FastifyAdapter>,
  ) {}
  onApplicationBootstrap() {
    const fastify = this.httpAdapterHost.httpAdapter.getInstance();
    if (!fastify.hasContentTypeParser('multipart')) {
      fastify.register((fastify, opts) => {
        fastify.addContentTypeParser(
          'multipart',
          function (request, payload, done) {
            multer.contentParser(fastify, opts, (err) => done(err ?? null));
          },
        );
      });
    }
  }
}
