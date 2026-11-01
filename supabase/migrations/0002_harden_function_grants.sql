-- 0002: trigger functions must not be callable over the REST API.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.log_row_change() from public, anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;
alter function public.set_updated_at() set search_path = public;
