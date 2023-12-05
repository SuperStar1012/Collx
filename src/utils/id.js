import {Buffer} from 'buffer';

export function decodeId(id) {
  return Buffer.from(id, 'base64').toString('ascii').split(':');
}

export function encodeId(scope, id) {
  return Buffer(`${scope}:${id}`).toString('base64')
}