
# 工具

----

通过以下 SQL 语句可以统计访问静态资源服务器的客户端 UA 信息。

```sql
CREATE TABLE IF NOT EXISTS useragent_origin_{YYYYMMDD-1D} (
  userAgent STRING,
  pv INT,
  uv INT
);

INSERT OVERWRITE TABLE useragent_origin_{YYYYMMDD-1D}
SELECT
  userAgent,
  count(remote_addr) AS pv,
  count(distinct remote_addr) AS uv
FROM (

  SELECT
    split(seqvalue, ' ')[2] AS remote_addr,
    split(seqvalue, '"')[3] AS userAgent
  FROM default.dwd_tec_monitor_log_ds
  WHERE
    dt = '{YYYYMMDD-1D}'
    AND (
      system_name='assets'
      OR system_name='apimg'
      OR system_name='static'
    )
    AND split(seqvalue, ' ')[11] = '200'
    AND split(seqvalue, ' ')[8] = '"GET'
    AND split(seqvalue, ' ')[15] RLIKE '^https?:\\/\\/\\w+\\.alipay\\.com\\/'
    AND split(seqvalue, ' ')[0] != '-'

) t
GROUP BY userAgent
ORDER BY uv DESC, pv DESC;
```

## 数据工厂导出后的处理

小于 10M 的数据导出为逗号分隔的 CSV 格式，并存储为 Excel 文件。
可以全选导出的 Excel 内容，复制粘贴到 Vim 中，然后重复执行以下代码，
直到没有需要替换的为止。

```
:%s/\t\(.*\t[0-9]\+\t[0-9]\+\)$/, \1/g
```
