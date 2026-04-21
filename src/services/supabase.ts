import supabase from '../supabaseClient';

const TABLE_PRODUCTS = 'products';
const TABLE_ORDERS = 'orders';

const responseData = (res) => {
  const { data, error } = res;
  if (error) throw new Error(error.message);
  return data;
};

// 注册
export const signUp = async (data: { email: string; password: string; options?: any }) => {
  const { email, password, options } = data;
  const res = await supabase.auth.signUp({
    email,
    password,
    options
  });
  return responseData(res);
};

// 登录
export const signIn = async (data: { email: string; password: string }) => {
  const { email, password } = data;
  const res = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return responseData(res);
};

// 退出
export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
};

// 获取用户信息
export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();
  console.log('getCurrentUser session', session);

  const res1 = await supabase.auth.getUser();
  const { data, error } = res1;
  console.log('getCurrentUser userinfo', data?.user, res1);

  if (!session.session && !data?.user) return null;

  supabase.auth.onAuthStateChange(async () => {
    const {
      data: { user }
    } = await supabase.auth.getUser();
    console.log('onAuthStateChange userinfo', user);
  });

  if (error) throw new Error(error.message);
  return data?.user;
}

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
export const updateProduct = async ({ id, updateProduct }: { id: number; updateProduct: EditProductData }) => {
  const res = await supabase.from(TABLE_PRODUCTS).update(updateProduct).eq('id', id).select().single();
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
