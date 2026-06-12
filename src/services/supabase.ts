import {
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials
} from '@supabase/supabase-js';
import supabase from '../lib/supabaseClient';

const TABLE_PRODUCTS = 'products';
const TABLE_ORDERS = 'orders';

const responseData = (res) => {
  const { data, error } = res;
  if (error) throw new Error(error.message);
  return data;
};

type SignInEmailCredentials = Extract<SignInWithPasswordCredentials, { email: string }>;
type SignUpEmailCredentials = Extract<SignUpWithPasswordCredentials, { email: string }>;

export const loginApi = {
  /** 注册（邮箱 + 密码，关闭邮件验证后注册即生效） */
  signUp: async (data: SignUpEmailCredentials) => {
    const { email, password, options } = data;
    const { data: res, error } = await supabase.auth.signUp({ email, password, options });
    if (error) {
      console.log('[注册失败]', error);
      throw new Error(error.message);
    }
    console.log('[注册成功]', res);
    // TODO 同步写入自维护的用户表
    if (res.user) {
      const { error: e } = await supabase.from('user_accounts').insert({
        auth_id: res.user.id,
        email,
        username: options?.data?.username || '',
        password
      });
      if (e) console.warn('[user_accounts 写入失败]', e.message);
    }
    return res;
  },

  /** 邮箱密码登录 */
  signIn: async (data: SignInEmailCredentials) => {
    const { email, password } = data;
    const { data: res, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.log('[登录失败]', error);
      throw new Error(error.message);
    }
    console.log('[登录成功]', res.user);
    // 更新自维护用户表的最近登录时间
    if (res.user) {
      const { error: e } = await supabase
        .from('user_accounts')
        .update({ last_sign_in_at: new Date().toISOString() })
        .eq('auth_id', res.user.id);
      if (e) console.warn('[user_accounts 更新失败]', e.message);
    }
    return res;
  },

  /** 退出 */
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }

  /** 获取当前登录用户（无 session 返回 null） */
  // getUser: async () => {
  //   const {
  //     data: { session }
  //   } = await supabase.auth.getSession();
  //   if (!session) return null;
  //   const { data, error } = await supabase.auth.getUser();
  //   console.log('supabase getUser', data);
  //   if (error) throw new Error(error.message);
  //   return data.user;
  // }
};

export interface Product {
  id: number;
  created_at: string;
  product: string;
  productName: string;
  productDesc: string;
  price: number;
}

export interface CreateProductData {
  product: string;
  productName: string;
  productDesc: string;
  price: number;
}

// 编辑
type EditProductData = Partial<Product>;

// 查找
export const getProducts = async () => {
  const res = await supabase.from(TABLE_PRODUCTS).select('*');
  return responseData(res);
};

// 增加
export const createProduct = async (createProduct: CreateProductData) => {
  const res = await supabase.from(TABLE_PRODUCTS).insert([createProduct]).select().single();
  return responseData(res);
};

// 删除
export const deleteProduct = async (id: number) => {
  const { error } = await supabase.from(TABLE_PRODUCTS).delete().eq('id', id);
  if (error) {
    throw new Error(error.message);
  }
};

// 修改
export const updateProduct = async ({
  id,
  updateProduct
}: {
  id: number;
  updateProduct: EditProductData;
}) => {
  const res = await supabase
    .from(TABLE_PRODUCTS)
    .update(updateProduct)
    .eq('id', id)
    .select()
    .single();
  return responseData(res);
};

// 对商品按价格排序 + 对商品按照价格范围筛选
export const getProductsAndFilter = async ({
  sortby,
  filters
}: {
  sortby?: { field: string; ascending: boolean };
  filters?: { field: string; method: string; value: string | number }[];
}) => {
  let query = supabase.from(TABLE_PRODUCTS).select('*');
  // 排序
  if (sortby) {
    query = query.order(sortby.field, { ascending: sortby.ascending });
  }
  // 过滤
  if (filters && filters.length > 0) {
    filters.forEach((filter) => {
      query = query?.[filter.method]?.(filter.field, filter.value);
    });
  }
  const res = await query;
  return responseData(res);
};

// 对订单查找关联商品表的信息（商品信息会根据对应的外键查找返回）
export const getOrders = async () => {
  const res = await supabase.from('orders').select('*, products(*)');
  return responseData(res);
};
