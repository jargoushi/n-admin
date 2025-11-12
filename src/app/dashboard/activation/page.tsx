'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ActivationApiService,
  ActivationTypeNames,
  ActivationStatusNames
} from '@/service/api/activation.api';

/**
 * 激活码 API 测试页面
 *
 * @description
 * 提供 6 个测试按钮，用于测试激活码模块的所有 API 接口
 * 所有响应结果将输出到浏览器控制台
 *
 * @note
 * 所有测试参数和逻辑已更新以匹配后端接口定义
 */
export default function ActivationTestPage() {
  /**
   * 测试批量初始化激活码 API
   *
   * @route POST /api/activation/init
   * @description 批量生成激活码（支持多种类型同时创建）
   */
  const handleInit = async () => {
    try {
      console.log('===== 测试批量初始化激活码 =====');
      const requestData = {
        items: [
          { type: 0, count: 5 }, // 生成 5 个日卡
          { type: 1, count: 3 } // 生成 3 个月卡
        ]
      };
      console.log('请求参数:', requestData);

      const response = await ActivationApiService.init(requestData);

      console.log('✅ 响应成功:', response);
      console.log('总数量:', response.data?.total_count);
      console.log('各类型结果:', response.data?.results);
      console.log('数量汇总:', response.data?.summary);

      // 打印每种类型的激活码
      response.data?.results.forEach((result) => {
        console.log(
          `${result.type_name} (${result.count} 个):`,
          result.activation_codes
        );
      });
    } catch (error) {
      console.error('❌ 初始化激活码失败:', error);
    }
  };

  /**
   * 测试派发激活码 API
   *
   * @route POST /api/activation/distribute
   * @description 根据类型派发指定数量未使用的激活码
   */
  const handleDistribute = async () => {
    try {
      console.log('===== 测试派发激活码 =====');
      const requestData = {
        type: 0, // 日卡
        count: 3 // 派发 3 个
      };
      console.log('请求参数:', requestData);

      const response = await ActivationApiService.distribute(requestData);

      console.log('✅ 响应成功:', response);
      console.log('派发的激活码列表:', response.data);
      console.log('派发数量:', response.data?.length);
    } catch (error) {
      console.error('❌ 派发激活码失败:', error);
    }
  };

  /**
   * 测试激活码激活 API
   *
   * @route POST /api/activation/activate
   * @description 激活已分发的激活码
   */
  const handleActivate = async () => {
    try {
      console.log('===== 测试激活码激活 =====');
      const activationCode = '3fa318c70f1fbc5b7775baff725b935ewJUvF275huX17ZPI'; // 请替换为实际的激活码
      console.log('激活码:', activationCode);

      const response = await ActivationApiService.activate(activationCode);

      console.log('✅ 响应成功:', response);
      console.log('激活码详情:', response.data);
      console.log('类型:', response.data?.type_name);
      console.log('状态:', response.data?.status_name);
      console.log('激活时间:', response.data?.activated_at);
      console.log('过期时间:', response.data?.expire_time);
    } catch (error) {
      console.error('❌ 激活码激活失败:', error);
    }
  };

  /**
   * 测试作废激活码 API
   *
   * @route POST /api/activation/invalidate
   * @description 作废已分发或已激活的激活码
   */
  const handleInvalidate = async () => {
    try {
      console.log('===== 测试作废激活码 =====');
      const requestData = {
        activation_code: '3fa318c70f1fbc5b7775baff725b935ewJUvF275huX17ZPI' // 请替换为实际的激活码
      };
      console.log('请求参数:', requestData);

      const response = await ActivationApiService.invalidate(requestData);

      console.log('✅ 响应成功:', response);
      console.log('作废结果:', response.data ? '成功' : '失败');
    } catch (error) {
      console.error('❌ 作废激活码失败:', error);
    }
  };

  /**
   * 测试获取激活码详情 API
   *
   * @route GET /api/activation/{activation_code}
   * @description 根据激活码字符串获取详细信息
   */
  const handleGetDetail = async () => {
    try {
      console.log('===== 测试获取激活码详情 =====');
      const activationCode = '3fa318c70f1fbc5b7775baff725b935ewJUvF275huX17ZPI'; // 请替换为实际的激活码
      console.log('查询激活码:', activationCode);

      const response = await ActivationApiService.getDetail(activationCode);

      console.log('✅ 响应成功:', response);
      console.log('激活码详情:', response.data);
      console.log('ID:', response.data?.id);
      console.log('激活码:', response.data?.activation_code);
      console.log(
        '类型:',
        `${response.data?.type_name} (${response.data?.type})`
      );
      console.log(
        '状态:',
        `${response.data?.status_name} (${response.data?.status})`
      );
      console.log('分发时间:', response.data?.distributed_at || '未分发');
      console.log('激活时间:', response.data?.activated_at || '未激活');
      console.log('过期时间:', response.data?.expire_time || '无');
      console.log('创建时间:', response.data?.created_at);
    } catch (error) {
      console.error('❌ 获取激活码详情失败:', error);
    }
  };

  /**
   * 测试获取激活码分页列表 API
   *
   * @route POST /api/activation/pageList
   * @description 分页查询激活码列表，支持多种筛选条件
   */
  const handleGetPageList = async () => {
    try {
      console.log('===== 测试获取激活码分页列表 =====');
      const queryParams = {
        page: 1,
        size: 10,
        type: 0 // 筛选日卡
      };
      console.log('请求参数:', queryParams);

      const response = await ActivationApiService.getPageList(queryParams);

      console.log('✅ 响应成功:', response);
      console.log('激活码列表:', response.data?.items);
      console.log('分页信息:', {
        当前页: response.data?.page,
        每页数量: response.data?.size,
        总记录数: response.data?.total,
        总页数: response.data?.pages
      });

      // 打印前 3 条激活码详情
      response.data?.items.slice(0, 3).forEach((item, index) => {
        console.log(`第 ${index + 1} 条:`, {
          激活码: item.activation_code,
          类型: item.type_name,
          状态: item.status_name,
          创建时间: item.created_at
        });
      });
    } catch (error) {
      console.error('❌ 获取激活码列表失败:', error);
    }
  };

  return (
    <div className='container mx-auto py-8'>
      <Card>
        <CardHeader>
          <CardTitle>激活码 API 测试</CardTitle>
          <p className='text-muted-foreground text-sm'>
            点击下方按钮测试各个 API 接口，所有响应结果将输出到浏览器控制台 (按
            F12 打开开发者工具查看)
          </p>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* 按钮网格 */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {/* 1. 批量初始化激活码 */}
            <Button
              onClick={handleInit}
              variant='default'
              size='lg'
              className='h-auto flex-col gap-2 py-4'
            >
              <span className='text-base font-semibold'>
                1. 批量初始化激活码
              </span>
              <span className='text-xs opacity-80'>
                POST /api/activation/init
              </span>
            </Button>

            {/* 2. 派发激活码 */}
            <Button
              onClick={handleDistribute}
              variant='default'
              size='lg'
              className='h-auto flex-col gap-2 py-4'
            >
              <span className='text-base font-semibold'>2. 派发激活码</span>
              <span className='text-xs opacity-80'>
                POST /api/activation/distribute
              </span>
            </Button>

            {/* 3. 激活码激活 */}
            <Button
              onClick={handleActivate}
              variant='default'
              size='lg'
              className='h-auto flex-col gap-2 py-4'
            >
              <span className='text-base font-semibold'>3. 激活码激活</span>
              <span className='text-xs opacity-80'>
                POST /api/activation/activate
              </span>
            </Button>

            {/* 4. 作废激活码 */}
            <Button
              onClick={handleInvalidate}
              variant='default'
              size='lg'
              className='h-auto flex-col gap-2 py-4'
            >
              <span className='text-base font-semibold'>4. 作废激活码</span>
              <span className='text-xs opacity-80'>
                POST /api/activation/invalidate
              </span>
            </Button>

            {/* 5. 获取激活码详情 */}
            <Button
              onClick={handleGetDetail}
              variant='secondary'
              size='lg'
              className='h-auto flex-col gap-2 py-4'
            >
              <span className='text-base font-semibold'>5. 获取激活码详情</span>
              <span className='text-xs opacity-80'>
                GET /api/activation/:code
              </span>
            </Button>

            {/* 6. 获取激活码列表 */}
            <Button
              onClick={handleGetPageList}
              variant='secondary'
              size='lg'
              className='h-auto flex-col gap-2 py-4'
            >
              <span className='text-base font-semibold'>6. 获取激活码列表</span>
              <span className='text-xs opacity-80'>
                POST /api/activation/pageList
              </span>
            </Button>
          </div>

          {/* 类型和状态说明 */}
          <div className='grid gap-4 md:grid-cols-2'>
            <div className='bg-muted/50 rounded-lg border p-4'>
              <h3 className='mb-2 font-semibold'>激活码类型</h3>
              <ul className='text-muted-foreground space-y-1 text-sm'>
                <li>• 0: {ActivationTypeNames[0]}</li>
                <li>• 1: {ActivationTypeNames[1]}</li>
                <li>• 2: {ActivationTypeNames[2]}</li>
                <li>• 3: {ActivationTypeNames[3]}</li>
              </ul>
            </div>

            <div className='bg-muted/50 rounded-lg border p-4'>
              <h3 className='mb-2 font-semibold'>激活码状态</h3>
              <ul className='text-muted-foreground space-y-1 text-sm'>
                <li>• 0: {ActivationStatusNames[0]}</li>
                <li>• 1: {ActivationStatusNames[1]}</li>
                <li>• 2: {ActivationStatusNames[2]}</li>
                <li>• 3: {ActivationStatusNames[3]}</li>
              </ul>
            </div>
          </div>

          {/* 使用说明 */}
          <div className='bg-muted/50 rounded-lg border p-4'>
            <h3 className='mb-2 font-semibold'>使用说明</h3>
            <ul className='text-muted-foreground space-y-1 text-sm'>
              <li>• 打开浏览器开发者工具 (F12) 查看控制台输出</li>
              <li>• 每个按钮对应一个后端 API 接口</li>
              <li>• 点击按钮后会自动调用接口并打印详细的请求和响应信息</li>
              <li>• 测试前请先执行"批量初始化激活码"生成测试数据</li>
              <li>• 部分接口需要替换测试参数中的激活码字符串为实际值</li>
              <li>• 确保后端服务已启动且数据库已初始化</li>
            </ul>
          </div>

          {/* 测试流程建议 */}
          <div className='rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950'>
            <h3 className='mb-2 font-semibold text-blue-900 dark:text-blue-100'>
              推荐测试流程
            </h3>
            <ol className='space-y-1 text-sm text-blue-700 dark:text-blue-300'>
              <li>1. 点击"批量初始化激活码"生成测试数据</li>
              <li>2. 复制控制台输出的激活码字符串</li>
              <li>3. 修改代码中的 TEST-CODE-12345 为实际激活码</li>
              <li>4. 依次测试派发、激活、作废、查询详情和列表</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
