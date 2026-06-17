// lib/mock-data.ts
import { Camera, EdgeNode } from './types';

export const mockCameras: Camera[] = [
  { id: 'cam-1', name: '摄像头#1', location: '3号工地-东南角', edgeNodeId: 'node-bj', status: 'online', latency: 15 },
  { id: 'cam-2', name: '摄像头#2', location: '5号工地-北侧', edgeNodeId: 'node-sh', status: 'online', latency: 18 },
  { id: 'cam-3', name: '摄像头#3', location: '仓库B-2号门', edgeNodeId: 'node-gz', status: 'online', latency: 12 },
  { id: 'cam-4', name: '摄像头#4', location: '工地入口-东门', edgeNodeId: 'node-cd', status: 'online', latency: 19 },
  { id: 'cam-5', name: '摄像头#5', location: '3号工地-西侧', edgeNodeId: 'node-sy', status: 'degraded', latency: 21 },
  { id: 'cam-6', name: '摄像头#6', location: '停车场A区', edgeNodeId: 'node-bj', status: 'online', latency: 16 },
];

export const mockEdgeNodes: EdgeNode[] = [
  { id: 'node-bj', name: '北京节点', city: '北京', load: 62, latency: 12, fps: 28, status: 'healthy', cameraIds: ['cam-1', 'cam-6'] },
  { id: 'node-sh', name: '上海节点', city: '上海', load: 45, latency: 15, fps: 30, status: 'healthy', cameraIds: ['cam-2'] },
  { id: 'node-gz', name: '广州节点', city: '广州', load: 38, latency: 18, fps: 25, status: 'healthy', cameraIds: ['cam-3'] },
  { id: 'node-cd', name: '成都节点', city: '成都', load: 31, latency: 22, fps: 22, status: 'healthy', cameraIds: ['cam-4'] },
  { id: 'node-sy', name: '沈阳节点', city: '沈阳', load: 51, latency: 14, fps: 26, status: 'busy', cameraIds: ['cam-5'] },
];
