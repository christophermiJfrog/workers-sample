import { PlatformContext, PlatformClients, PlatformHttpClient } from 'jfrog-workers';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { BeforeCopyRequest, ActionStatus } from './types';
import runWorker from './worker';

describe("restrict-overwrite tests", () => {
    let context: DeepMocked<PlatformContext>;
    let request: DeepMocked<BeforeCopyRequest>;

    beforeEach(() => {
        context = createMock<PlatformContext>({
            clients: createMock<PlatformClients>({
                platformHttp: createMock<PlatformHttpClient>({
                    get: jest.fn().mockResolvedValue({ status: 200 })
                })
            })
        });
        request = createMock<BeforeCopyRequest>({
            metadata: { repoPath: { key: 'my-repo', path: 'artifact.txt' } }
        });
    })

    it('should run', async () => {
        await expect(runWorker(context, request)).resolves.toEqual(expect.objectContaining({
            message: 'Overwritten by worker-service if an error occurs.',
            status: ActionStatus.PROCEED,
            modifiedRepoPath: { key: 'my-repo', path: 'artifact.txt' }
        }))
    })
});