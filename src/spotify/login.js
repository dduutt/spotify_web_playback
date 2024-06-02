import kv from '../kv'
export default {
  setToken: async (token, expires_in) => {

    const data = `["SET", "token", "${token}","ex", "${expires_in}"]`
    await kv(data)

  },

  getToken: async () => {
    const data = '["GET", "token"]'
    const resp = await kv(data)
    return resp.result
  }
};
